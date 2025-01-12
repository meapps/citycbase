import { useState, useCallback } from 'react';
import { GamePhase, GameState, Cell } from '../types';
import { createTurnTransaction, generateHash } from '../utils/transactionUtils';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'planning',
    turn: 1,
    lastTransactionHash: '',
    objectives: [
      {
        id: 'build-powerplant',
        description: 'Build your first Power Plant',
        completed: false,
        reward: 100,
        requirements: { buildingType: 'powerplant', count: 1 }
      },
      {
        id: 'reach-population',
        description: 'Reach 100 population',
        completed: false,
        reward: 200,
        requirements: { resources: { population: 100 } }
      }
    ],
    achievements: [
      {
        id: 'builder',
        name: 'Master Builder',
        description: 'Build 50 structures',
        unlocked: false,
        progress: 0,
        total: 50
      }
    ],
    difficulty: 'medium',
    resources: {
      gold: 1000,
      energy: 100,
      population: 0
    },
    tutorial: {
      completed: false,
      currentStep: 0
    }
  });

  const nextPhase = useCallback(() => {
    setGameState(prev => {
      const phases: GamePhase[] = ['planning', 'attack', 'defense'];
      const currentIndex = phases.indexOf(prev.phase);
      const nextIndex = (currentIndex + 1) % phases.length;
      
      const newState = {
        ...prev,
        phase: phases[nextIndex],
        turn: nextIndex === 0 ? prev.turn + 1 : prev.turn
      };

      const transaction = createTurnTransaction(newState, [], prev.lastTransactionHash);
      const newHash = generateHash(JSON.stringify(transaction));
      
      return {
        ...newState,
        lastTransactionHash: newHash
      };
    });
  }, []);

  return {
    gameState,
    nextPhase
  };
}