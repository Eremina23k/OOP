import { Board, Ship, BOARD_SIZE, SHIPS_CONFIG, ShipOrientation } from '../types';

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty'));
};

export const isValidPlacement = (
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: ShipOrientation
): boolean => {
  const positions: [number, number][] = [];
  
  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;
    
    if (row >= BOARD_SIZE || col >= BOARD_SIZE) return false;
    for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
        if (board[r][c] === 'ship') return false;
      }
    }
    
    positions.push([row, col]);
  }
  
  return true;
};

export const placeShip = (
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: ShipOrientation
): [Board, Ship] => {
  const newBoard = board.map(row => [...row]);
  const positions: [number, number][] = [];
  
  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;
    newBoard[row][col] = 'ship';
    positions.push([row, col]);
  }
  
  const ship: Ship = {
    positions,
    hits: 0,
    size,
    isDestroyed: false
  };
  
  return [newBoard, ship];
};

export const autoPlaceShips = (): { board: Board; ships: Ship[] } => {
  let board = createEmptyBoard();
  const ships: Ship[] = [];
  
  for (const { size, count } of SHIPS_CONFIG) {
    for (let i = 0; i < count; i++) {
      let placed = false;
      while (!placed) {
        const orientation: ShipOrientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const startRow = Math.floor(Math.random() * BOARD_SIZE);
        const startCol = Math.floor(Math.random() * BOARD_SIZE);
        
        if (isValidPlacement(board, startRow, startCol, size, orientation)) {
          const [newBoard, ship] = placeShip(board, startRow, startCol, size, orientation);
          board = newBoard;
          ships.push(ship);
          placed = true;
        }
      }
    }
  }
  
  return { board, ships };
}; 