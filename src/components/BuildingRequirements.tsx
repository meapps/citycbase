import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BuildingOption } from '../types';
import { getBuildingById } from '../utils/buildingUtils';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';

interface BuildingRequirementsProps {
  building: BuildingOption;
  onClose: () => void;
}

export const BuildingRequirements: React.FC<BuildingRequirementsProps> = ({ 
  building, 
  onClose 
}) => {
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${theme.surface} p-4 rounded-lg shadow-xl max-w-xs w-full m-4`}>
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className={`font-bold text-sm ${theme.text}`}>Building Requirements</h3>
            <p className={`text-sm ${theme.text} opacity-75`}>
              The following buildings are required:
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {building.requirements?.map(reqId => {
            const reqBuilding = getBuildingById(reqId);
            return (
              <div key={reqId} className={`flex items-center gap-2 text-sm ${theme.text}`}>
                <span>{reqBuilding?.emoji}</span>
                <span>{reqBuilding?.name}</span>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={onClose}
          className={`w-full px-4 py-2 text-sm ${theme.secondary} ${theme.hover} rounded-lg transition-colors ${theme.text}`}
        >
          Got it
        </button>
      </div>
    </div>
  );
};