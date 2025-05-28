import { BoardProps } from '../types';

export default function BoardComponent ({ board, onCellClick, showShips, disabled = false }: BoardProps) {
  const getCellClass = (cell: string) => {
    switch (cell) {
      case 'ship': return showShips ? 'cell ship' : 'cell';
      case 'hit': return 'cell hit';
      case 'miss': return 'cell miss';
      default: return 'cell';
    }
  };

  return (
    <div className={`board ${disabled ? 'disabled' : ''}`}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(cell)}
              onClick={() => onCellClick && onCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

