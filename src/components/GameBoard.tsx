import React, { useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';
import { BuildingOption, Cell, CombatResult } from '../types';
import { usePreferences } from '../hooks/usePreferences';
import { themes } from '../utils/themes';
import { useGameState } from '../hooks/useGameState';
import { useHistory } from '../hooks/useHistory';
import { useHotkeys } from '../hooks/useHotkeys';
import { BUILDING_OPTIONS, canPlaceBuilding, isConstructionComplete, getBuildingByEmoji } from '../utils/buildingUtils';
import { processCombat } from '../utils/combatUtils';
import { initializeGrid, canPlaceMultiCellBuilding, placeMultiCellBuilding } from '../utils/gridUtils';
import { soundManager } from '../utils/soundEffects';
import { useDataPersistence } from '../hooks/useDataPersistence';
import { BuildingRequirements } from './BuildingRequirements';
import CombatAnimation from './CombatAnimation';
import BuildingTooltip from './BuildingTooltip';
import BuildingProgress from './BuildingProgress';
import SidePanel from './SidePanel';
import PhaseIndicator from './PhaseIndicator';
import UndoRedo from './UndoRedo';
import QuickSelect from './QuickSelect';

const DEFAULT_GRID_SIZE = { width: 12, height: 8 };

const GameBoard: React.FC = () => {
  const { preferences } = usePreferences();
  const theme = themes[preferences.theme || 'classic'];
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [grid, setGrid] = useState<Cell[][]>(
    initializeGrid(DEFAULT_GRID_SIZE.width, DEFAULT_GRID_SIZE.height)
  );
  const [tooltipBuilding, setTooltipBuilding] = useState<BuildingOption | null>(null);
  const [showRequirements, setShowRequirements] = useState<BuildingOption | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [combatAnimations, setCombatAnimations] = useState<CombatResult[]>([]);
  const { gameState, nextPhase } = useGameState();
  const { saveGame, loadGame } = useDataPersistence();
  const { pushState, undo, redo, canUndo, canRedo } = useHistory();

  // Setup hotkeys
  useHotkeys(BUILDING_OPTIONS, setSelectedTool);

  // Load saved game on mount
  useEffect(() => {
    const loadSavedGame = async () => {
      const { state, grid: savedGrid } = await loadGame();
      if (state && savedGrid) {
        setGrid(savedGrid);
        // Update game state through your state management
      }
    };
    loadSavedGame();
  }, []);

  // Auto-save on state changes if enabled
  useEffect(() => {
    if (preferences.autoSave) {
      saveGame(gameState, grid);
    }
  }, [gameState, grid, preferences.autoSave]);

  const handleNextPhase = () => {
    if (gameState.phase === 'attack') {
      processAttackPhase();
    } else {
      nextPhase();
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.phase !== 'planning') return;
    if (!selectedTool) return;
    
    soundManager.play('build');
    
    // Save current state for undo
    pushState(grid);

    // Handle building upgrades
    if (selectedTool === 'upgrade') {
      const cell = grid[row][col];
      if (!cell.content) return;
      return;
    }

    const building = BUILDING_OPTIONS.find(b => b.id === selectedTool);
    if (!building) return;
    
    if (!canPlaceBuilding(building, grid, row, col) || 
        !canPlaceMultiCellBuilding(building, grid, row, col)) {
      setShowRequirements(building);
      return;
    }

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row] = [...prev[row]];
      
      if (selectedTool === 'eraser') {
        newGrid[row][col] = { content: null, health: null, attack: null, level: 1 };
      } else {
        if (building.size.width === 1 && building.size.height === 1) {
          newGrid[row][col] = {
            content: building.emoji, health: building.health,
            attack: building.attack, level: building.level,
            constructionStartTime: Date.now()
          };
        } else {
          return placeMultiCellBuilding(building, newGrid, row, col);
        }
      }
      
      return newGrid;
    });
  };

  const processAttackPhase = () => {
    if (gameState.phase !== 'attack') return;
    
    const { newGrid, combatResults } = processCombat(grid, DEFAULT_GRID_SIZE);
    
    // Queue combat animations
    setCombatAnimations(combatResults);
    soundManager.play('attack');
    
    // Update grid after animations complete
    setTimeout(() => {
      setGrid(newGrid);
      setCombatAnimations([]);
      nextPhase();
    }, combatResults.length * 1000);
  };
  const clearGrid = () => {
    setGrid(initializeGrid(DEFAULT_GRID_SIZE.width, DEFAULT_GRID_SIZE.height));
  };

  const handleShowTooltip = (building: BuildingOption, event: React.MouseEvent) => {
    setTooltipBuilding(building);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleHideTooltip = () => {
    setTooltipBuilding(null);
  };

  return (
    <div className={`flex flex-col gap-4 p-4 max-w-md mx-auto ${theme.background}`}>
      <div className="flex-1 space-y-4">
        <PhaseIndicator
          currentPhase={gameState.phase}
          turn={gameState.turn}
          onNextPhase={handleNextPhase}
          rightContent={
            <UndoRedo
              onUndo={() => {
                const prevState = undo();
                if (prevState) setGrid(prevState);
              }}
              onRedo={() => {
                const nextState = redo();
                if (nextState) setGrid(nextState);
              }}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          }
        />
        <div 
          className={`grid gap-0.5 ${theme.secondary} p-0.5 rounded-lg`}
          style={{ 
            gridTemplateColumns: `repeat(${DEFAULT_GRID_SIZE.width}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square ${theme.surface} rounded border-2 ${theme.border}
                  ${cell.terrain === 'mountain' ? 'bg-gray-200' : 
                    cell.terrain === 'water' ? 'bg-blue-100' : 'bg-green-50'}
                  flex flex-col items-center justify-center text-lg
                  cursor-pointer transition-all duration-150 ${theme.hover}
                  ${hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex ? 'border-gray-400' : ''}
                  ${gameState.phase !== 'planning' && cell.content ? 'relative' : ''}
                  ${cell.zone ? `border-${
                    cell.zone === 'residential' ? 'green' :
                    cell.zone === 'commercial' ? 'blue' : 'yellow'
                  }-300` : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  opacity: cell.content && !isConstructionComplete(cell) ? 0.5 : 1
                }}
                onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                onMouseLeave={() => setHoveredCell(null)}
                onMouseMove={(e) => {
                  const building = getBuildingByEmoji(cell.content);
                  if (building) {
                    handleShowTooltip(building, e);
                  }
                }}
                onMouseOut={handleHideTooltip}
              >
                <span>{cell.content || (
                  hoveredCell?.row === rowIndex && 
                  hoveredCell?.col === colIndex && 
                  selectedTool && 
                  selectedTool !== 'eraser' ? 
                    BUILDING_OPTIONS.find(b => b.id === selectedTool)?.emoji : 
                    ''
                )}</span>
                {cell.content && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="bg-black bg-opacity-50 text-white text-[10px] leading-tight px-0.5 rounded-t">
                      {`${cell.health} | Lvl ${cell.level}`}
                    </div>
                  </div>
                )}
                {cell.constructionStartTime && !isConstructionComplete(cell) && (
                  <BuildingProgress cell={cell} />
                )}
                {combatAnimations.map((result, index) => (
                  result.attacker.row === rowIndex && 
                  result.attacker.col === colIndex && (
                    <CombatAnimation
                      key={index}
                      result={result}
                      onComplete={() => {
                        setCombatAnimations(prev => 
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  )
                ))}
              </div>
            ))
          ))}
        </div>
        {tooltipBuilding && (
          <BuildingTooltip
            building={tooltipBuilding}
            position={tooltipPosition}
          />
        )}
        {showRequirements && (
          <BuildingRequirements
            building={showRequirements}
            onClose={() => setShowRequirements(null)}
          />
        )}
        
        <QuickSelect
          buildings={BUILDING_OPTIONS}
          onSelect={(building) => setSelectedTool(building.id)}
        />
      </div>

      <SidePanel
        buildingOptions={BUILDING_OPTIONS}
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        onClearGrid={gameState.phase === 'planning' ? clearGrid : undefined}
        gamePhase={gameState.phase}
      />
    </div>
  );
};

export default GameBoard;