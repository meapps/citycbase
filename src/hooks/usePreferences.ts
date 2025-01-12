import React, { useState, useCallback, useEffect } from 'react';
import { UserPreferences } from '../types';
import { localStorageManager } from '../utils/storage/localStorageManager';

// Debounce localStorage saves
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  gridSize: { width: 12, height: 8 },
  theme: 'classic',
  autoSave: true
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    DEFAULT_PREFERENCES
  );

  useEffect(() => {
    // Load preferences on mount
    const savedPrefs = localStorageManager.loadPreferences();
    setPreferences(prev => ({ ...prev, ...savedPrefs }));
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((prefs: UserPreferences) => {
      localStorageManager.savePreferences(prefs);
    }),
    []
  );

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, ...updates };
      debouncedSave(newPreferences);
      return newPreferences; // Return immediately for instant UI updates
    });
  }, []);

  return {
    preferences,
    updatePreferences
  };
}