import React from 'react';
import { ArrowUpCircle, Coins } from 'lucide-react';
import { Cell, BuildingOption } from '../types';
import { getBuildingByEmoji, getBuildingById } from '../utils/buildingUtils';

interface UpgradeModalProps {
  cell: Cell;
  onUpgrade: (upgrade: BuildingOption) => void;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  cell, 
  onUpgrade, 
  onClose 
}) => {
  const currentBuilding = getBuildingByEmoji(cell.content);
  if (!currentBuilding?.upgrades?.length) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-xs w-full m-4">
        <div className="flex items-start gap-3 mb-4">
          <ArrowUpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Available Upgrades</h3>
            <p className="text-sm text-gray-600">
              Select an upgrade path:
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {currentBuilding.upgrades.map(upgrade => {
            const upgradeBuilding = getBuildingById(upgrade.to);
            if (!upgradeBuilding) return null;
            
            return (
              <button
                key={upgrade.to}
                onClick={() => onUpgrade(upgradeBuilding)}
                className="w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span>{upgradeBuilding.emoji}</span>
                  <span className="flex-1">{upgradeBuilding.name}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">{upgrade.cost}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  HP: {currentBuilding.health} → {upgradeBuilding.health}
                  <br />
                  ATK: {currentBuilding.attack} → {upgradeBuilding.attack}
                </div>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};