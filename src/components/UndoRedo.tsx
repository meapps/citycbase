import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';

interface UndoRedoProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedo: React.FC<UndoRedoProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];

  return (
    <div className="flex gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          p-1.5 rounded-lg ${theme.hover}
          ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className={`w-4 h-4 ${theme.text}`} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`
          p-1.5 rounded-lg ${theme.hover}
          ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className={`w-4 h-4 ${theme.text}`} />
      </button>
    </div>
  );
};

export default UndoRedo;