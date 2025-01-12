import React from 'react';
import { Eraser, Trash2 } from 'lucide-react';
import { BuildingOption, GamePhase } from '../types';
import BuildingCard from './BuildingCard';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';
import ThemeSelector from './ThemeSelector';

interface SidePanelProps {
  buildingOptions: BuildingOption[];
  selectedTool: string | null;
  onSelectTool: (tool: string) => void;
  onClearGrid?: () => void;
  gamePhase: GamePhase;
}

const SidePanel: React.FC<SidePanelProps> = ({
  buildingOptions,
  selectedTool,
  onSelectTool,
  onClearGrid,
  gamePhase,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  return (
    <div className={`${theme.surface} ${theme.text} rounded-lg shadow-lg p-3 h-fit`}>
      <h2 className="text-lg font-bold mb-2">Building Options</h2>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Categories</h3>
        <div className="flex gap-2">
          {['basic', 'advanced', 'special'].map(category => (
            <button
              key={category}
              className={`
                px-2 py-1 text-xs rounded-full
                ${selectedCategory === category
                  ? `${theme.selected} ${theme.text}`
                  : `${theme.secondary} ${theme.text} ${theme.hover}`
                }
              `}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {buildingOptions
          .filter(option => !selectedCategory || option.category === selectedCategory)
          .map((option) => (
          <BuildingCard
            key={option.id}
            building={option}
            selected={selectedTool === option.id}
            onClick={() => onSelectTool(option.id)}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          />
        ))}

        <button
          onClick={() => onSelectTool('eraser')}
          disabled={gamePhase !== 'planning'}
          className={`
            w-full text-left p-2 rounded-lg flex items-center gap-2 ${theme.text}
            transition-colors duration-150
            ${selectedTool === 'eraser'
              ? theme.selected
              : theme.hover
            }
            ${gamePhase !== 'planning' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Eraser className="w-5 h-5" />
          <span>Eraser</span>
        </button>

        {onClearGrid && (
          <>
            <hr className="my-2" />

            <button
              onClick={onClearGrid}
              className={`w-full p-2 rounded-lg flex items-center gap-2 text-red-400 ${theme.hover} transition-colors duration-150`}
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SidePanel;