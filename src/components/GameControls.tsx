import { GameControlsProps } from '../types';

export default function GameControls({ 
  onReset, 
  onSurrender, 
  gameStatus, 
  currentPlayer,
  players,
  gameMode
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <div className="game-status">
        {gameStatus === 'gameOver' ? (
          <div className="game-over">
            <h2>Игра окончена!</h2>
            <div className="scores">
              <p>{players.player1.name || 'Игрок 1'}: {players.player1.score} очков</p>
              <p>
                {gameMode === 'computer' 
                  ? `Компьютер: ${players.computer.score} очков`
                  : `${players.player2.name || 'Игрок 2'}: ${players.player2.score} очков`}
              </p>
            </div>
            <p className="winner">
              Победитель: {
                gameMode === 'computer'
                  ? players.player1.score > players.computer.score 
                    ? players.player1.name || 'Игрок 1'
                    : 'Компьютер'
                  : players.player1.score > players.player2.score 
                    ? players.player1.name || 'Игрок 1'
                    : players.player2.name || 'Игрок 2'
              }
            </p>
          </div>
        ) : (
          <p>Ход игрока: {players[currentPlayer].name || (currentPlayer === 'player1' ? 'Игрок 1' : currentPlayer === 'player2' ? 'Игрок 2' : 'Компьютер')}</p>
        )}
      </div>
      
      <div className="buttons">
        <button onClick={onReset}>Новая игра</button>
        {gameStatus === 'playing' && (
          <button onClick={onSurrender}>Сдаться</button>
        )}
      </div>
      </div>
    );
}
  