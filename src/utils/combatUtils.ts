import { Cell, BuildingOption } from '../types';
import { getBuildingByEmoji } from './buildingUtils';

interface CombatResult {
  damage: number;
  attacker: { row: number; col: number };
  target: { row: number; col: number };
}

export function processCombat(
  grid: Cell[][],
  gridSize: { width: number; height: number }
): { newGrid: Cell[][], combatResults: CombatResult[] } {
  const newGrid = grid.map(row => [...row]);
  const combatResults: CombatResult[] = [];

  // Process all attacks
  for (let i = 0; i < gridSize.height; i++) {
    for (let j = 0; j < gridSize.width; j++) {
      const attacker = newGrid[i][j];
      if (!attacker.attack || !attacker.content) continue;

      // Get valid targets
      const targets = getValidTargets(newGrid, i, j, gridSize);
      if (targets.length === 0) continue;

      // Select random target and apply damage
      const target = targets[Math.floor(Math.random() * targets.length)];
      const damage = attacker.attack;

      // Apply damage and record combat result
      newGrid[target.row][target.col].health! -= damage;
      combatResults.push({
        damage,
        attacker: { row: i, col: j },
        target: { row: target.row, col: target.col }
      });

      // Remove destroyed buildings
      if (newGrid[target.row][target.col].health! <= 0) {
        newGrid[target.row][target.col] = {
          content: null,
          health: null,
          attack: null,
          level: 1
        };
      }
    }
  }

  // Process special abilities
  processSpecialAbilities(newGrid, gridSize);

  return { newGrid, combatResults };
}

function getValidTargets(
  grid: Cell[][],
  row: number,
  col: number,
  gridSize: { width: number; height: number }
): { row: number; col: number }[] {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return directions
    .map(([dx, dy]) => ({ row: row + dx, col: col + dy }))
    .filter(({row, col}) => 
      row >= 0 && row < gridSize.height &&
      col >= 0 && col < gridSize.width &&
      grid[row][col].health &&
      grid[row][col].content
    );
}

function processSpecialAbilities(
  grid: Cell[][],
  gridSize: { width: number; height: number }
): void {
  for (let i = 0; i < gridSize.height; i++) {
    for (let j = 0; j < gridSize.width; j++) {
      const cell = grid[i][j];
      if (!cell.content) continue;

      const building = getBuildingByEmoji(cell.content);
      if (!building?.ability) continue;

      const adjacentCells = getValidTargets(grid, i, j, gridSize);
      
      switch (building.ability.effect) {
        case 'heal':
          adjacentCells.forEach(({row, col}) => {
            const target = grid[row][col];
            const targetBuilding = getBuildingByEmoji(target.content);
            if (targetBuilding) {
              target.health = Math.min(
                target.health! + 20,
                targetBuilding.health
              );
            }
          });
          break;
        case 'boost':
          adjacentCells.forEach(({row, col}) => {
            grid[row][col].attack = Math.floor(grid[row][col].attack! * 1.2);
          });
          break;
        // Add other ability effects here
      }
    }
  }
}