import { useEffect, useCallback } from 'react';
import { BuildingOption } from '../types';

interface HotkeyConfig {
  key: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useHotkeys(buildingOptions: BuildingOption[], onSelectTool: (id: string) => void) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const hotkeys: HotkeyConfig[] = [
      { key: 'z', ctrl: true, action: () => {} }, // Undo
      { key: 'y', ctrl: true, action: () => {} }, // Redo
      { key: 'Escape', action: () => onSelectTool('') }, // Clear selection
      ...buildingOptions.map((building, index) => ({
        key: (index + 1).toString(),
        action: () => onSelectTool(building.id)
      }))
    ];

    const matchingHotkey = hotkeys.find(hotkey => {
      const keyMatch = event.key.toLowerCase() === hotkey.key.toLowerCase();
      const ctrlMatch = !!hotkey.ctrl === event.ctrlKey;
      const shiftMatch = !!hotkey.shift === event.shiftKey;
      const altMatch = !!hotkey.alt === event.altKey;
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingHotkey) {
      event.preventDefault();
      matchingHotkey.action();
    }
  }, [buildingOptions, onSelectTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}