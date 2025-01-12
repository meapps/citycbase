import React from 'react';
import { BuildingOption } from '../types';
import { Shield, Sword, Clock } from 'lucide-react';

interface BuildingTooltipProps {
  building: BuildingOption;
  position: { x: number; y: number };
}

const BuildingTooltip: React.FC<BuildingTooltipProps> = ({ building, position }) => {
  return (
    <div 
      className="absolute z-50 bg-white rounded-lg shadow-xl p-3 w-64"
      style={{
        left: position.x + 20,
        top: position.y + 20
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{building.emoji}</span>
        <h3 className="font-bold">{building.name}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span>HP: {building.health}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sword className="w-4 h-4 text-red-500" />
          <span>ATK: {building.attack}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Build Time: {building.constructionTime / 1000}s</span>
        </div>
      </div>

      {building.ability && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-sm font-medium text-blue-600">
            {building.ability.name}
          </p>
          <p className="text-xs text-gray-600">
            {building.ability.description}
          </p>
        </div>
      )}

      {building.requirements?.length ? (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-gray-500">
            Requires: {building.requirements.join(', ')}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default BuildingTooltip;