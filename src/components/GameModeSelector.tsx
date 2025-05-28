import { GameMode } from '../types';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  return (
    <div className="mode-selector">
      <h2>Выберите режим игры</h2>
      <div className="mode-buttons">
        <button onClick={() => onSelectMode('computer')}>
          Играть против компьютера
        </button>
        <button onClick={() => onSelectMode('player')}>
          Играть против друга
        </button>
      </div>
    </div>
  );
}


