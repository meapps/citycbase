import React from 'react';
import { Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { themes } from '../utils/themes';
import { usePreferences } from '../hooks/usePreferences';

export const themeColors = {
  classic: '#4B5563',
  dark: '#1F2937',
  forest: '#059669',
  desert: '#D97706',
  ocean: '#0891B2'
};

interface ThemeSelectorProps {
  compact?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const { preferences, updatePreferences } = usePreferences();
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = themes[preferences.theme || 'classic'];
  const [hoveredTheme, setHoveredTheme] = React.useState<string | null>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute -left-2 top-1/2 -translate-y-1/2 p-1 rounded-full
          ${theme.surface} ${theme.border} border shadow-sm
          hover:shadow-md transition-all duration-200
        `}
      >
        {isOpen ? (
          <ChevronLeft className={`w-4 h-4 ${theme.text}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${theme.text}`} />
        )}
      </button>
      
      <div className={`
        absolute left-0 top-1/2
        transition-all duration-200 ease-in-out
        ${theme.surface} ${theme.border} border rounded-lg shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto
        ${isOpen ? 'translate-x-2 opacity-100' : '-translate-x-full opacity-0'}
        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        w-40
      `}>
        <div className="p-1.5">
          <div className="flex items-center gap-2 mb-3">
            <Palette className={`w-4 h-4 ${theme.text}`} />
            <span className={`text-sm font-medium ${theme.text}`}>Theme</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(themeColors).map(([themeName, color]) => (
              <button
                key={themeName}
                onClick={() => {
                  updatePreferences({ theme: themeName as any });
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredTheme(themeName)}
                onMouseLeave={() => setHoveredTheme(null)}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded text-left
                  transition-all duration-200 whitespace-nowrap
                  ${preferences.theme === themeName ? theme.selected : theme.hover}
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded-full
                    ${preferences.theme === themeName ? 'ring-2 ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: color, flexShrink: 0 }}
                />
                <span className={`text-sm ${theme.text}`}>
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;