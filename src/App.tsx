import { useState } from 'react';
import './App.css';
import GameModeSelector from './components/GameModeSelector';
import GameControls from './components/GameControls';
import ShipPlacement from './components/ShipPlacement';
import GameBoard from './components/GameBoard';
import { GameMode, GameState, GameStatus, AppState } from './types';
import { makeMove, computerMove } from './utils/gameLogic';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [appState, setAppState] = useState<AppState>('mode-selection');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setAppState('ship-placement');
  };

  const handleGameStart = (newGameState: GameState) => {
    setGameState(newGameState);
    setAppState('playing');
  };

  const handleGameReset = () => {
    setGameMode(null);
    setAppState('mode-selection');
    setGameState(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') {
      console.warn('Игра не активна');
      return;
    }

    const isPlayer1Turn = gameState.currentPlayer === 'player1';
    const isPlayer2Turn = gameState.currentPlayer === 'player2';

    const targetPlayer = gameState.currentPlayer === 'player1' 
      ? (gameState.gameMode === 'computer' ? 'computer' : 'player2')
      : 'player1';

    const isClickingOpponentBoard = (isPlayer1Turn && targetPlayer === 'player2') || 
                                  (isPlayer1Turn && targetPlayer === 'computer') ||
                                  (isPlayer2Turn && targetPlayer === 'player1');

    if (!isClickingOpponentBoard) {
      console.warn('Нельзя атаковать свое поле');
      return;
    }

    const newGameState = makeMove({...gameState}, row, col, targetPlayer);
    
    if (newGameState !== gameState) {
      setGameState(newGameState);

      if (gameState.gameMode === 'computer' && newGameState.currentPlayer === 'computer') {
        const makeComputerMove = (currentState: GameState) => {
          setTimeout(() => {
            const computerGameState = computerMove({...currentState});
            if (computerGameState !== currentState) {
              setGameState(computerGameState);
              if (computerGameState.currentPlayer === 'computer' && 
                  computerGameState.gameStatus === 'playing') {
                const lastRow = computerGameState.boards.player1.findIndex(row => 
                  row.some(cell => cell === 'hit' || cell === 'destroyed')
                );
                if (lastRow !== -1) {
                  const lastCol = computerGameState.boards.player1[lastRow].findIndex(
                    cell => cell === 'hit' || cell === 'destroyed'
                  );
                  if (lastCol !== -1) {
                    makeComputerMove(computerGameState);
                  }
                }
              }
            }
          }, 1000);
        };
        makeComputerMove(newGameState);
      }
    }
  };

  const handleSurrender = () => {
    if (!gameState || gameState.gameStatus !== 'playing') {
      console.warn('Игра не активна');
      return;
    }

    let winner: 'player1' | 'player2' | 'computer';
    if (gameState.gameMode === 'computer') {
      winner = gameState.currentPlayer === 'player1' ? 'computer' : 'player1';
    } else {
      winner = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
    }

    const newGameState: GameState = {
      ...gameState,
      gameStatus: 'gameOver' as GameStatus,
      currentPlayer: winner,
      players: {
        ...gameState.players,
        [winner]: {
          ...gameState.players[winner],
          score: gameState.players[winner].score + 50 
        }
      }
    };

    setGameState(newGameState);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Морской Бой</h1>
      </header>

      {appState === 'mode-selection' && (
        <GameModeSelector onSelectMode={handleSelectMode} />
      )}

      {appState === 'ship-placement' && gameMode && (
        <ShipPlacement 
          onGameStart={handleGameStart} 
          gameMode={gameMode}
          onAutoPlace={() => {
            console.log('Корабли автоматически расставлены');
          }}
        />
      )}

      {appState === 'playing' && gameState && (
        <>
          <GameControls 
            onReset={handleGameReset}
            onSurrender={handleSurrender}
            gameStatus={gameState.gameStatus}
            currentPlayer={gameState.currentPlayer}
            players={gameState.players}
            gameMode={gameState.gameMode}
          />
          <GameBoard 
            gameState={gameState}
            onCellClick={handleCellClick}
            isCurrentPlayer={true}
          />
        </>
      )}
    </div>
  );
}

