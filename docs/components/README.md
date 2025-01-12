# Component Documentation

## Core Components

### GameBoard
The main game board component that orchestrates the entire game.

**Props:** None

**State:**
- `selectedTool`: Currently selected building or tool
- `grid`: 2D array representing the game grid
- `hoveredCell`: Currently hovered cell coordinates
- `tooltipBuilding`: Building being displayed in tooltip
- `combatAnimations`: Active combat animations
- `gameState`: Current game state (phase, turn, etc.)

**Key Features:**
- Grid rendering and interaction
- Building placement logic
- Combat phase handling
- Theme integration
- Undo/Redo functionality

### BuildingCard
Displays individual building options with stats and tooltips.

**Props:**
- `building: BuildingOption` - Building data to display
- `selected: boolean` - Whether this building is selected
- `onClick: () => void` - Click handler
- `onMouseEnter: (e: React.MouseEvent) => void` - Mouse enter handler
- `onMouseLeave: () => void` - Mouse leave handler

**Features:**
- Lazy-loaded tooltips
- Theme integration
- Stats display
- Hover effects

### PhaseIndicator
Shows current game phase and turn information.

**Props:**
- `currentPhase: GamePhase` - Current game phase
- `turn: number` - Current turn number
- `onNextPhase: () => void` - Phase advancement handler
- `rightContent?: React.ReactNode` - Optional right-side content

**Features:**
- Phase-specific icons and colors
- Theme integration
- Turn counter
- Next phase button

## UI Components

### ThemeSelector
Manages theme selection and preview.

**Props:**
- `compact?: boolean` - Whether to show compact version

**Features:**
- Live theme preview
- Smooth transitions
- Theme persistence
- Keyboard navigation

### QuickSelect
Quick access bar for building selection.

**Props:**
- `buildings: BuildingOption[]` - Available buildings
- `onSelect: (building: BuildingOption) => void` - Selection handler

**Features:**
- Keyboard shortcuts
- Visual feedback
- Theme integration

### UndoRedo
Controls for undo/redo functionality.

**Props:**
- `onUndo: () => void` - Undo handler
- `onRedo: () => void` - Redo handler
- `canUndo: boolean` - Whether undo is available
- `canRedo: boolean` - Whether redo is available

**Features:**
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Visual feedback
- Theme integration