import React from 'react';
import { Coins, Battery, Users } from 'lucide-react';
import { Resources } from '../types';

interface GameStatsProps {
  resources: Resources;
}

const GameStats: React.FC<GameStatsProps> = ({ resources }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium">{resources.gold}</span>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">{resources.energy}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">{resources.population}</span>
        </div>
      </div>
    </div>
  );
};