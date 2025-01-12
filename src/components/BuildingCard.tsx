import React, { lazy, Suspense } from 'react';
import { BuildingOption } from '../types';
import { Shield, Sword } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';

const BuildingTooltip = lazy(() => import('./BuildingTooltip'));

interface BuildingCardProps {
  building: BuildingOption;
  selected: boolean;
  onClick: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        setShowTooltip(true);
        onMouseEnter(e);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
        onMouseLeave();
      }}
      className={`
        w-full text-left p-2 rounded-lg flex items-center gap-2
        transition-colors duration-150
        ${selected ? theme.selected : theme.hover}
        ${theme.text}
      `}
    >
      <span className="text-lg flex-shrink-0">{building.emoji}</span>
      <div className="flex-1">
        <div>{building.name}</div>
        <div className={`text-[10px] leading-tight opacity-75 flex items-center gap-2`}>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {building.health}
          </span>
          <span className="flex items-center gap-1">
            <Sword className="w-3 h-3" />
            {building.attack}
          </span>
        </div>
      </div>

      {showTooltip && (
        <Suspense fallback={null}>
          <BuildingTooltip
            building={building}
            position={{ x: 0, y: 0 }}
          />
        </Suspense>
      )}
    </button>
  );
};

export default BuildingCard;