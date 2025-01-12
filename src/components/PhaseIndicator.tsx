import React from 'react';
import { Timer, Swords, Shield } from 'lucide-react';
import { GamePhase } from '../types';
import ThemeSelector from './ThemeSelector';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';

interface PhaseIndicatorProps {
  currentPhase: GamePhase;
  turn: number;
  onNextPhase: () => void;
  rightContent?: React.ReactNode;
}

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  currentPhase,
  turn,
  onNextPhase,
  rightContent
}) => {
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  const getPhaseIcon = (phase: GamePhase) => {
    switch (phase) {
      case 'planning':
        return <Timer className="w-6 h-6" />;
      case 'attack':
        return <Swords className="w-6 h-6" />;
      case 'defense':
        return <Shield className="w-6 h-6" />;
    }
  };

  const getPhaseColor = (phase: GamePhase) => {
    switch (phase) {
      case 'planning':
        return 'bg-blue-100 text-blue-700';
      case 'attack':
        return 'bg-red-100 text-red-700';
      case 'defense':
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className={`${theme.surface} rounded-lg shadow-lg p-3 mb-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getPhaseColor(currentPhase)}`}>
              <div className="w-5 h-5">{getPhaseIcon(currentPhase)}</div>
            </div>
            <div>
              <h2 className={`text-lg font-bold capitalize ${theme.text}`}>{currentPhase} Phase</h2>
              <p className={`text-sm ${theme.text} opacity-75`}>Turn {turn}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 mx-2" />
          <div className="flex-shrink-0 relative">
            <ThemeSelector compact />
          </div>
          <div className="ml-2">
            {rightContent}
          </div>
        </div>
        {currentPhase !== 'defense' && (
          <button
            onClick={onNextPhase}
            className={`px-3 py-1.5 text-sm ${theme.accent} text-white rounded-lg hover:opacity-90 transition-colors`}
          >
            Next Phase
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseIndicator;