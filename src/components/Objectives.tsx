import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Objective } from '../types';

interface ObjectivesProps {
  objectives: Objective[];
}

const Objectives: React.FC<ObjectivesProps> = ({ objectives }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 mb-4">
      <h3 className="text-lg font-bold mb-2">Objectives</h3>
      <div className="space-y-2">
        {objectives.map(objective => (
          <div
            key={objective.id}
            className="flex items-start gap-2 p-2 rounded-lg bg-gray-50"
          >
            {objective.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm">{objective.description}</p>
              <p className="text-xs text-gray-500">Reward: {objective.reward} gold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};