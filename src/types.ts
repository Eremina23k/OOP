export type CellValue = 'empty' | 'ship' | 'hit' | 'miss' | 'destroyed';
export type Board = CellValue[][];
export type GameMode = 'computer' | 'player';
export type GameStatus = 'setup' | 'playing' | 'gameOver';
export type Player = 'player1' | 'player2' | 'computer';
export type ShipOrientation = 'horizontal' | 'vertical';
export type AppState = 'mode-selection' | 'ship-placement' | 'playing';

export interface Ship {
  positions: [number, number][];
  hits: number;
  size: number;
  isDestroyed: boolean;
}

export interface PlayerInfo {
  name: string;
  score: number;
}

export interface GameState {
  boards: Record<Player, Board>;
  ships: Record<Player, Ship[]>;
  currentPlayer: Player;
  players: Record<Player, PlayerInfo>;
  gameStatus: GameStatus;
  gameMode: GameMode;
  currentMove?: { row: number; col: number };
}

export const BOARD_SIZE = 10;
export const SHIPS_CONFIG = [
  { size: 4, count: 1 },
  { size: 3, count: 2 },
  { size: 2, count: 3 },
  { size: 1, count: 4 }
];

export interface ShipPlacementProps {
  onGameStart: (gameState: GameState) => void;
  gameMode: GameMode;
  onAutoPlace: () => void;
}

export interface GameControlsProps {
  onReset: () => void;
  onSurrender: () => void;
  gameStatus: GameStatus;
  currentPlayer: Player;
  players: Record<Player, PlayerInfo>;
  gameMode: GameMode;
}

export interface BoardProps {
  board: Board;
  onCellClick?: (row: number, col: number) => void;
  showShips: boolean;
  disabled?: boolean;
}

export interface GameBoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
  isCurrentPlayer: boolean;
}