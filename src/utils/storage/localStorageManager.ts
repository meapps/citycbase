import { GameState, Cell } from '../../types';
import { UserPreferences } from '../../types';

const STORAGE_KEYS = {
  GAME_STATE: 'cityBuilder.gameState',
  GRID: 'cityBuilder.grid',
  PREFERENCES: 'cityBuilder.preferences',
  LAST_SAVE: 'cityBuilder.lastSave'
} as const;

export const localStorageManager = {
  saveGameState(state: GameState, grid: Cell[][]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
      localStorage.setItem(STORAGE_KEYS.GRID, JSON.stringify(grid));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVE, Date.now().toString());
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },

  loadGameState(): { state: GameState | null; grid: Cell[][] | null } {
    try {
      const stateJson = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      const gridJson = localStorage.getItem(STORAGE_KEYS.GRID);
      
      return {
        state: stateJson ? JSON.parse(stateJson) : null,
        grid: gridJson ? JSON.parse(gridJson) : null
      };
    } catch (error) {
      console.error('Failed to load game state:', error);
      return { state: null, grid: null };
    }
  },

  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  },

  loadPreferences(): UserPreferences {
    try {
      const json = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return json ? JSON.parse(json) : {};
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return {};
    }
  },

  clearSaveData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear save data:', error);
    }
  }
};