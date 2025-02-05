import { GameState,Room } from "../../domain/entity/gameTypes";

const rooms: { [slug: string]: Room } = {}; // Store game state for each room

export function createRoom(slug: string): void {
  if (!rooms[slug]) {
    rooms[slug] = {
      board: Array(9).fill(""),
      isXTurn: true,
      winner: null,
      players: [],
      spectators: [],
      gameStarted: false,
    };
  }
}

export function joinRoom(slug: string, socketId: string): "X" | "O" | null {
  const room = rooms[slug];
  if (!room) return null;

  if (room.players.length < 2) {
    const symbol = room.players.length === 0 ? "X" : "O";
    room.players.push({ id: socketId, symbol });
    return symbol;
  }
  return null;
}

export function makeMove(slug: string, index: number, symbol: "X" | "O"): GameState | null {
  const room = rooms[slug];
  if (!room || !room.gameStarted || room.winner || room.board[index] !== "") return null;

  room.board[index] = symbol;
  room.isXTurn = !room.isXTurn;
  room.winner = checkWinner(room.board);

  if (!room.winner && room.board.every((cell) => cell !== "")) {
    room.winner = "Draw";
  }

  return { board: room.board, isXTurn: room.isXTurn, winner: room.winner };
}

export function resetGame(slug: string): GameState | null {
  const room = rooms[slug];
  if (!room) return null;

  room.board = Array(9).fill("");
  room.isXTurn = true;
  room.winner = null;
  room.gameStarted = true;

  return { board: room.board, isXTurn: room.isXTurn, winner: room.winner };
}

export function checkWinner(board: string[]): string | null {
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

export function removePlayerFromRoom(slug: string, socketId: string): void {
  const room = rooms[slug];
  if (!room) return;

  room.players = room.players.filter((player) => player.id !== socketId);
  room.spectators = room.spectators.filter((id) => id !== socketId);

  if (room.players.length === 0) {
    room.gameStarted = false;
    room.board = Array(9).fill("");
    room.winner = null;
  }
}
