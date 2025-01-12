import React from 'react';
import { BuildingOption } from '../types';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';

interface QuickSelectProps {
  buildings: BuildingOption[];
  onSelect: (building: BuildingOption) => void;
}

const QuickSelect: React.FC<QuickSelectProps> = ({ buildings, onSelect }) => {
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 ${theme.surface} rounded-lg shadow-lg p-2 flex gap-2`}>
      {buildings.slice(0, 9).map((building, index) => (
        <button
          key={building.id}
          onClick={() => onSelect(building)}
          className={`
            p-2 rounded ${theme.hover} transition-all duration-150
            flex flex-col items-center gap-1
          `}
        >
          <span className="text-xl">{building.emoji}</span>
          <span className={`text-xs ${theme.text}`}>{index + 1}</span>
        </button>
      ))}
    </div>
  );
}

export default QuickSelect;