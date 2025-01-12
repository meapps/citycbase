export interface UserPreferences {
  soundEnabled: boolean;
  gridSize: { width: number; height: number };
  theme: 'classic' | 'dark' | 'forest' | 'desert' | 'ocean';
  autoSave: boolean;
}