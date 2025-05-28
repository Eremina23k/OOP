import { GameBoardProps, CellValue } from '../types';

export default function GameBoard({ gameState, onCellClick }: GameBoardProps) {
  const renderCell = (cell: CellValue, rowIndex: number, colIndex: number, isPlayerBoard: boolean) => {
    let cellContent = '';
    let cellClassName = 'cell';

    if (gameState.gameMode === 'computer') {
      const isPlayer1Turn = gameState.currentPlayer === 'player1';
      const canClick = isPlayer1Turn && !isPlayerBoard && 
        cell !== 'hit' && cell !== 'miss' && cell !== 'destroyed';

      if (gameState.gameStatus === 'playing' && cell === 'ship' && !isPlayerBoard) {
        cellClassName += ' empty';
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cellClassName}
            onClick={() => canClick && onCellClick(rowIndex, colIndex)}
          >
            {cellContent}
          </div>
        );
      }
    } else {
      const isPlayer1Turn = gameState.currentPlayer === 'player1';
      const canClick = ((isPlayer1Turn && !isPlayerBoard) || (!isPlayer1Turn && isPlayerBoard)) && 
        cell !== 'hit' && cell !== 'miss' && cell !== 'destroyed';

      if (gameState.gameStatus === 'playing' && cell === 'ship') {
        cellClassName += ' empty';
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cellClassName}
            onClick={() => canClick && onCellClick(rowIndex, colIndex)}
          >
            {cellContent}
          </div>
        );
      }
    }

    switch (cell) {
      case 'hit':
        cellContent = '×';
        cellClassName += ' hit';
        break;
      case 'miss':
        cellContent = '•';
        cellClassName += ' miss';
        break;
      case 'destroyed':
        cellContent = '×';
        cellClassName += ' destroyed';
        break;
      case 'ship':
        cellClassName += gameState.gameStatus === 'playing' && gameState.gameMode !== 'computer' ? ' empty' : ' ship';
        break;
      default:
        cellClassName += ' empty';
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={cellClassName}
        onClick={() => {
          if (gameState.gameMode === 'computer') {
            const isPlayer1Turn = gameState.currentPlayer === 'player1';
            const canClick = isPlayer1Turn && !isPlayerBoard && 
              cell !== 'hit' && cell !== 'miss' && cell !== 'destroyed';
            canClick && onCellClick(rowIndex, colIndex);
          } else {
            const isPlayer1Turn = gameState.currentPlayer === 'player1';
            const canClick = ((isPlayer1Turn && !isPlayerBoard) || (!isPlayer1Turn && isPlayerBoard)) && 
              cell !== 'hit' && cell !== 'miss' && cell !== 'destroyed';
            canClick && onCellClick(rowIndex, colIndex);
          }
        }}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="game-boards">
      <div className="board-container">
        <h3>{gameState.players.player1.name}</h3>
        <div className="score">Счёт: {gameState.players.player1.score}</div>
        <div className="board">
          {gameState.boards.player1.map((row: CellValue[], rowIndex: number) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell: CellValue, colIndex: number) => renderCell(cell, rowIndex, colIndex, true))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="board-container">
        <h3>
          {gameState.gameMode === 'computer' 
            ? 'Компьютер' 
            : gameState.players.player2.name}
        </h3>
        <div className="score">
          Счёт: {gameState.gameMode === 'computer' 
            ? gameState.players.computer.score 
            : gameState.players.player2.score}
        </div>
        <div className="board">
          {gameState.boards[gameState.gameMode === 'computer' ? 'computer' : 'player2'].map((row: CellValue[], rowIndex: number) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell: CellValue, colIndex: number) => renderCell(cell, rowIndex, colIndex, false))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
