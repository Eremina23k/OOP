import { GameState, GameMode, Player, BOARD_SIZE } from '../types';
import { createEmptyBoard, autoPlaceShips } from './shipPlacement';

export const makeMove = (
  gameState: GameState,
  row: number,
  col: number,
  targetPlayer: Player
): GameState => {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    return gameState;
  }

  const newState = { ...gameState };
  const targetBoard = newState.boards[targetPlayer];
  const targetShips = newState.ships[targetPlayer];

  newState.currentMove = { row, col };

  if (targetBoard[row][col] === 'hit' || targetBoard[row][col] === 'miss' || targetBoard[row][col] === 'destroyed') {
    return gameState;
  }
  
  const isHit = targetBoard[row][col] === 'ship';
  const newBoard = targetBoard.map(r => [...r]);
  newBoard[row][col] = isHit ? 'hit' : 'miss';
  
  if (isHit) {
    const hitShip = targetShips.find(ship => 
      ship.positions.some(([r, c]) => r === row && c === col)
    );
    
    if (hitShip) {
      hitShip.hits++;
      
      if (hitShip.hits === hitShip.size) {
        hitShip.isDestroyed = true;
        hitShip.positions.forEach(([r, c]) => {
          newBoard[r][c] = 'destroyed';
        });
        
        hitShip.positions.forEach(([r, c]) => {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 && nr < newBoard.length &&
                nc >= 0 && nc < newBoard[0].length &&
                newBoard[nr][nc] === 'empty'
              ) {
                newBoard[nr][nc] = 'miss';
              }
            }
          }
        });
        
        newState.players[gameState.currentPlayer].score += 15;
      } else {
        newState.players[gameState.currentPlayer].score += 10;
      }
    }
  } else {
    const opponent = gameState.gameMode === 'computer' 
      ? (gameState.currentPlayer === 'computer' ? 'player1' : 'computer')
      : (gameState.currentPlayer === 'player1' ? 'player2' : 'player1');
    newState.players[opponent].score += 5;
  }
  
  newState.boards[targetPlayer] = newBoard;
  
  const allShipsDestroyed = targetShips.every(ship => ship.isDestroyed);
  if (allShipsDestroyed) {
    newState.gameStatus = 'gameOver';
    newState.players[gameState.currentPlayer].score += 50;
    newState.currentPlayer = gameState.currentPlayer;
    return newState;
  }

  if (!isHit) {
    if (gameState.gameMode === 'computer') {
      if (gameState.currentPlayer === 'player1') {
        newState.currentPlayer = 'computer';
      } else {
        newState.currentPlayer = 'player1';
      }
    } else {
      newState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
    }
  } else {
    newState.currentPlayer = gameState.currentPlayer;
  }
  
  return newState;
};

export const computerMove = (gameState: GameState): GameState => {
  const board = gameState.boards.player1;
  const availableMoves: [number, number][] = [];
  const hitCells: [number, number][] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 'empty' || board[row][col] === 'ship') {
        availableMoves.push([row, col]);
      } else if (board[row][col] === 'hit') {
        hitCells.push([row, col]);
      }
    }
  }
  
    if (availableMoves.length === 0) {
    return gameState;
  }

  let selectedMove: [number, number];
  
  if (hitCells.length > 0) {
    const lastHit = hitCells[hitCells.length - 1];
    const [lastRow, lastCol] = lastHit;
    
    const directions: [number, number][] = [
      [-1, 0],  // верх
      [1, 0],   // низ
      [0, -1],  // лево
      [0, 1]    // право
    ];
    
    let shipDirection: [number, number] | null = null;
    if (hitCells.length >= 2) {
      const [prevRow, prevCol] = hitCells[hitCells.length - 2];
      const rowDiff = lastRow - prevRow;
      const colDiff = lastCol - prevCol;
      if (rowDiff !== 0) {
        shipDirection = [rowDiff, 0];
      } else if (colDiff !== 0) {
        shipDirection = [0, colDiff];
      }
    }
    
    if (shipDirection) {
      const [dr, dc] = shipDirection;
      const nextRow = lastRow + dr;
      const nextCol = lastCol + dc;
      
      if (
        nextRow >= 0 && nextRow < board.length &&
        nextCol >= 0 && nextCol < board[0].length &&
        availableMoves.some(([r, c]) => r === nextRow && c === nextCol)
      ) {
        selectedMove = [nextRow, nextCol];
      } else {
        const oppositeRow = hitCells[0][0] - dr;
        const oppositeCol = hitCells[0][1] - dc;
        
        if (
          oppositeRow >= 0 && oppositeRow < board.length &&
          oppositeCol >= 0 && oppositeCol < board[0].length &&
          availableMoves.some(([r, c]) => r === oppositeRow && c === oppositeCol)
        ) {
          selectedMove = [oppositeRow, oppositeCol];
        } else {
          const validNeighbors = directions
            .map(([dr, dc]) => [lastRow + dr, lastCol + dc])
            .filter(([r, c]) => 
              r >= 0 && r < board.length && 
              c >= 0 && c < board[0].length &&
              availableMoves.some(([ar, ac]) => ar === r && ac === c)
            );
          
          if (validNeighbors.length > 0) {
            const randomIndex = Math.floor(Math.random() * validNeighbors.length);
            selectedMove = validNeighbors[randomIndex] as [number, number];
          } else {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            selectedMove = availableMoves[randomIndex];
          }
        }
      }
    } else {
      const validNeighbors = directions
        .map(([dr, dc]) => [lastRow + dr, lastCol + dc])
        .filter(([r, c]) => 
          r >= 0 && r < board.length && 
          c >= 0 && c < board[0].length &&
          availableMoves.some(([ar, ac]) => ar === r && ac === c)
        );
      
      if (validNeighbors.length > 0) {
        const randomIndex = Math.floor(Math.random() * validNeighbors.length);
        selectedMove = validNeighbors[randomIndex] as [number, number];
      } else {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        selectedMove = availableMoves[randomIndex];
      }
    }
  } else {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    selectedMove = availableMoves[randomIndex];
  }
  
  const newState = makeMove({...gameState}, selectedMove[0], selectedMove[1], 'player1');
  
  if (newState !== gameState) {
    if (newState.gameStatus === 'gameOver') {
      return newState;
    }
    
    const lastMove = newState.currentMove;
    if (lastMove) {
      const cellValue = newState.boards.player1[lastMove.row][lastMove.col];
      if (cellValue === 'hit' || cellValue === 'destroyed') {
        return newState;
      } else {
        newState.currentPlayer = 'player1';
        return newState;
      }
    }
  }
  
  return gameState;
};

export function createInitialGameState(gameMode: GameMode, player1Name: string, player2Name: string): GameState {
  const initialState: GameState = {
    boards: {
      player1: createEmptyBoard(),
      player2: createEmptyBoard(),
      computer: createEmptyBoard()
    },
    ships: {
      player1: [],
      player2: [],
      computer: []
    },
    currentPlayer: 'player1', 
    players: {
      player1: { name: player1Name, score: 0 },
      player2: { name: player2Name, score: 0 },
      computer: { name: 'Компьютер', score: 0 }
    },
    gameStatus: 'setup',
    gameMode
  };

  if (gameMode === 'computer') {
    const { board, ships } = autoPlaceShips();
    initialState.boards.computer = board;
    initialState.ships.computer = ships;
  }
  
  return initialState;
} 