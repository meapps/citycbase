import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Cell } from '../types';
import { getBuildingByEmoji, isConstructionComplete } from '../utils/buildingUtils';

interface BuildingProgressProps {
  cell: Cell;
}

const BuildingProgress: React.FC<BuildingProgressProps> = ({ cell }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!cell.constructionStartTime) return;
    
    const building = getBuildingByEmoji(cell.content);
    if (!building) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - cell.constructionStartTime!;
      const newProgress = Math.min(100, (elapsed / building.constructionTime) * 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [cell]);

  if (!cell.constructionStartTime || isConstructionComplete(cell)) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-full px-2">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-center mt-1">
          <Timer className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
};

export default BuildingProgress;