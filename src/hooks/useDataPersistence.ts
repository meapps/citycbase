import { useEffect, useCallback } from 'react';
import { GameState, Cell } from '../types';
import { localStorageManager } from '../utils/storage/localStorageManager';
import { cloudSaveManager } from '../utils/storage/cloudSaveManager';

export function useDataPersistence() {
  // Auto-save every 5 minutes
  useEffect(() => {
    const preferences = localStorageManager.loadPreferences();
    if (!preferences.autoSave) return;

    const interval = setInterval(() => {
      const { state, grid } = localStorageManager.loadGameState();
      if (state && grid) {
        cloudSaveManager.saveToCloud(state, grid);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const saveGame = useCallback(async (state: GameState, grid: Cell[][]) => {
    localStorageManager.saveGameState(state, grid);
    await cloudSaveManager.saveToCloud(state, grid);
  }, []);

  const loadGame = useCallback(async () => {
    // Try cloud first, fall back to local
    const cloudData = await cloudSaveManager.loadFromCloud();
    if (cloudData) {
      return { state: cloudData.state, grid: cloudData.grid };
    }
    
    return localStorageManager.loadGameState();
  }, []);

  const clearSaveData = useCallback(async () => {
    localStorageManager.clearSaveData();
    // Here you would also clear cloud saves when implemented
  }, []);

  return {
    saveGame,
    loadGame,
    clearSaveData
  };
}