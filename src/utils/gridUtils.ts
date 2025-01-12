import { Cell, BuildingOption } from '../types';

export function initializeGrid(width: number, height: number): Cell[][] {
  return Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({
      content: null,
      health: null,
      attack: null,
      level: 1,
      terrain: Math.random() < 0.1 ? 'mountain' :
               Math.random() < 0.2 ? 'water' : 'grass'
    }))
  );
}

export function canPlaceMultiCellBuilding(
  building: BuildingOption,
  grid: Cell[][],
  startRow: number,
  startCol: number
): boolean {
  const { width, height } = building.size;
  
  // Check if building fits within grid bounds
  if (startRow + height > grid.length || startCol + width > grid[0].length) {
    return false;
  }

  // Check if all required cells are empty and have compatible terrain
  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      const cell = grid[row][col];
      if (cell.content || cell.terrain === 'mountain') {
        return false;
      }
    }
  }

  return true;
}

export function placeMultiCellBuilding(
  building: BuildingOption,
  grid: Cell[][],
  startRow: number,
  startCol: number
): Cell[][] {
  const newGrid = grid.map(row => [...row]);
  const { width, height } = building.size;
  const buildingId = `${building.id}-${Date.now()}`;

  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      newGrid[row][col] = {
        content: building.emoji,
        health: building.health,
        attack: building.attack,
        level: building.level,
        constructionStartTime: Date.now(),
        buildingPartOf: {
          id: buildingId,
          x: startRow,
          y: startCol
        }
      };
    }
  }

  return newGrid;
}