export interface Player {
  user_id: number | undefined;
  id: string;
  symbol: 'X' | 'O';
}

export interface Room {
  board: string[];
  isXTurn: boolean;
  winner: string | null;
  players: Player[];
  spectators: string[];
  gameStarted: boolean;
}