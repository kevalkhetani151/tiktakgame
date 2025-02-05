
import { Server, Socket } from 'socket.io';
import { Player,Room } from '../../domain/entity/gameTypes';
import prisma from '../../config/db.config';


export class GameController {
  private io: Server;
  private rooms: Record<string, Room> = {}; 

  constructor(io: Server) {
    this.io = io;
  }

  async handleJoinRoom(socket: Socket, slug: string,user_id:number): Promise<void> {
    
    if (!this.rooms[slug]) {
      this.rooms[slug] = {
        board: Array(9).fill(""),
        isXTurn: true,
        winner: null,
        players: [],
        spectators: [],
        gameStarted: false,
      };
    }

    const room = this.rooms[slug];
    socket.join(slug);
    console.log("user connected")
    console.log(user_id)

    if (room.players.length < 2) {
      const symbol = room.players.length === 0 ? "X" : "O";
      
      //@ts-ignore
      room.players.push({ id: socket.id, symbol, user_id:socket.user.userId });
  
      this.io.to(socket.id).emit("player", { isPlayer: true, symbol, gameStarted: true });

      if (room.players.length === 2) {
        await prisma.room.update({
          where: { key: slug },
          data:{
            status:"View"
          }
      })
        room.gameStarted = true;
        this.io.to(slug).emit("gameStart", { message: "Game started!", board: room.board });
      }
    } else {
      room.spectators.push(socket.id);
      this.io.to(socket.id).emit("player", { isPlayer: false });
    }

    this.io.to(slug).emit("spectatorCount", room.spectators.length);
  }

  async handleMove(socket: Socket, slug: string, index: number):Promise<void> {
    const room = this.rooms[slug];
    if (!room || !room.gameStarted || room.winner || room.board[index] !== "") return;

    const player = room.players.find((p) => p.symbol === (room.isXTurn ? "X" : "O"));
    if (!player || player.id !== socket.id) return;

    room.board[index] = player.symbol;
    room.isXTurn = !room.isXTurn;
    room.winner = this.checkWinner(room.board);
    if(room.winner != null){
      
      console.log(player.user_id)
      await prisma.user.update({
        where: { id: player.user_id },
        data: {
          win: {
            increment: 1,
          },
        },
      })
      await prisma.room.update({
        where: { key: slug },
        data:{
          status:"Completed"
        }
    })
    }

    if (!room.winner && room.board.every((cell: string) => cell !== "")) {
      room.winner = "Draw";
    }

    this.io.to(slug).emit("boardUpdate", { board: room.board, isXTurn: room.isXTurn, winner: room.winner });
  }

  handleReset(slug: string): void {
    if (this.rooms[slug]) {
      Object.assign(this.rooms[slug], {
        board: Array(9).fill(""),
        isXTurn: true,
        winner: null,
        gameStarted: true,
      });
      this.io.to(slug).emit("boardUpdate", { board: this.rooms[slug].board, isXTurn: true, winner: null });
    }
  }

  handleDisconnect(socket: Socket): void {
    for (const slug in this.rooms) {
      const room = this.rooms[slug];
      room.players = room.players.filter((p) => p.id !== socket.id);
      room.spectators = room.spectators.filter((id) => id !== socket.id);
      this.io.to(slug).emit("spectatorCount", room.spectators.length);
      if (room.players.length === 0) {
        Object.assign(room, {
          gameStarted: false,
          board: Array(9).fill(""),
          winner: null,
        });
      }
    }
  }

  private checkWinner(board: string[]): string | null {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
}
