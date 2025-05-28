import { useState } from 'react';
import { ShipPlacementProps, ShipOrientation, SHIPS_CONFIG, GameStatus, Player } from '../types';
import { autoPlaceShips, isValidPlacement, placeShip } from '../utils/shipPlacement';
import { createInitialGameState } from '../utils/gameLogic';

export default function ShipPlacement({ onGameStart, gameMode, onAutoPlace }: ShipPlacementProps) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [selectedShipSize, setSelectedShipSize] = useState<number | null>(null);
  const [shipOrientation, setShipOrientation] = useState<ShipOrientation>('horizontal');
  const [gameState, setGameState] = useState(() => createInitialGameState(gameMode, '', ''));

  const handleBack = () => {
    window.location.reload(); 
  };

  const handleShipSelect = (size: number) => {
    setSelectedShipSize(size);
  };

  const handleOrientationChange = () => {
    setShipOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedShipSize) {
      alert('Пожалуйста, выберите корабль для размещения');
      return;
    }

    const currentPlayer = gameState.currentPlayer;
    const board = gameState.boards[currentPlayer];
    const ships = gameState.ships[currentPlayer];

    const shipConfig = SHIPS_CONFIG.find(config => config.size === selectedShipSize);
    if (!shipConfig) return;

    const placedShipsOfSize = ships.filter(ship => ship.size === selectedShipSize).length;
    if (placedShipsOfSize >= shipConfig.count) {
      alert(`Вы уже разместили максимальное количество кораблей размером ${selectedShipSize}`);
      return;
    }

    const canPlace = isValidPlacement(board, row, col, selectedShipSize, shipOrientation);
    if (!canPlace) {
      alert('Невозможно разместить корабль в этом месте');
      return;
    }

    const [newBoard, newShip] = placeShip(board, row, col, selectedShipSize, shipOrientation);
    
    setGameState(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentPlayer]: newBoard
      },
      ships: {
        ...prev.ships,
        [currentPlayer]: [...ships, newShip]
      }
    }));

    setSelectedShipSize(null);

    const totalShips = SHIPS_CONFIG.reduce((sum, { count }) => sum + count, 0);
    const placedShips = [...ships, newShip].length;
    
    if (placedShips === totalShips) {
      alert('Все корабли размещены!');
    }
  };

  const handleRemoveShip = (row: number, col: number) => {
    const currentPlayer = gameState.currentPlayer;
    const board = gameState.boards[currentPlayer];
    const ships = gameState.ships[currentPlayer];

    const shipToRemove = ships.find(ship => 
      ship.positions.some(([r, c]) => r === row && c === col)
    );

    if (!shipToRemove) return;

    const newBoard = board.map(row => [...row]);
    shipToRemove.positions.forEach(([r, c]) => {
      newBoard[r][c] = 'empty';
    });

    const newShips = ships.filter(ship => ship !== shipToRemove);

    setGameState(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentPlayer]: newBoard
      },
      ships: {
        ...prev.ships,
        [currentPlayer]: newShips
      }
    }));
  };

  const handleStartGame = () => {
    if (!player1Name.trim()) {
      alert('Пожалуйста, введите имя первого игрока');
      return;
    }

    if (gameMode === 'player' && !player2Name.trim()) {
      alert('Пожалуйста, введите имя второго игрока');
      return;
    }

    const totalShips = SHIPS_CONFIG.reduce((sum, { count }) => sum + count, 0);
    const placedShips = gameState.ships[gameState.currentPlayer].length;

    if (placedShips < totalShips) {
      alert('Пожалуйста, разместите все корабли перед началом игры');
      return;
    }

    if (gameState.currentPlayer === 'player1' && gameMode === 'player') {
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'player2',
        players: {
          ...prev.players,
          player1: { ...prev.players.player1, name: player1Name.trim() }
        }
      }));
      return;
    }

    const updatedGameState = {
      ...gameState,
      currentPlayer: 'player1' as Player, 
      players: {
        ...gameState.players,
        player1: { ...gameState.players.player1, name: player1Name.trim() },
        player2: { ...gameState.players.player2, name: player2Name.trim() }
      },
      gameStatus: 'playing' as GameStatus
    };

    onGameStart(updatedGameState);
  };

  const handleAutoPlace = () => {
    const { board, ships } = autoPlaceShips();
    const currentPlayer = gameState.currentPlayer;
    
    setGameState(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentPlayer]: board
      },
      ships: {
        ...prev.ships,
        [currentPlayer]: ships
      }
    }));

    onAutoPlace();
  };

  return (
    <div className="ship-placement">
      <div className="back-button-container">
        <button className="back-button" onClick={handleBack}>
          Назад к выбору режима
        </button>
      </div>
      <div className="player-info">
        <input
          type="text"
          placeholder="Имя игрока 1"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />
        {gameMode === 'player' && (
          <input
            type="text"
            placeholder="Имя игрока 2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        )}
      </div>

      <div className="ship-selection">
        <h3>Ход игрока: {gameState.currentPlayer === 'player1' ? player1Name || 'Игрок 1' : player2Name || 'Игрок 2'}</h3>
        <div className="ship-buttons">
          {SHIPS_CONFIG.map(({ size, count }) => (
            <button
              key={size}
              onClick={() => handleShipSelect(size)}
              className={selectedShipSize === size ? 'selected' : ''}
              disabled={count === 0}
            >
              Корабль {size} клетки ({count} шт.)
            </button>
          ))}
        </div>
        <button onClick={handleOrientationChange}>
          Повернуть корабль ({shipOrientation === 'horizontal' ? 'горизонтально' : 'вертикально'})
        </button>
      </div>
      
      <div className="board-container">
        <div className="board">
          {gameState.boards[gameState.currentPlayer].map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell}`}
                  onClick={() => {
                    if (cell === 'ship') {
                      handleRemoveShip(rowIndex, colIndex);
                    } else {
                      handleCellClick(rowIndex, colIndex);
                    }
                  }}
        />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <button onClick={handleAutoPlace}>Автоматическая расстановка</button>
        <button onClick={handleStartGame}>
          {gameState.currentPlayer === 'player1' && gameMode === 'player' 
            ? 'Завершить расстановку' 
            : 'Начать игру'}
      </button>
      </div>
    </div>
  );
}

