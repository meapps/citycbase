import { BuildingOption, Cell } from '../types';
import { buildingCache } from './cache/buildingCache';

export function canPlaceBuilding(
  building: BuildingOption,
  grid: Cell[][],
  row: number,
  col: number
): boolean {
  // Check if all required buildings exist
  if (building.requirements?.length) {
    return building.requirements.every(requiredBuildingId =>
      grid.some(row =>
        row.some(cell =>
          cell.content === getBuildingById(requiredBuildingId)?.emoji
        )
      )
    );
  }
  return true;
}

export function isConstructionComplete(cell: Cell): boolean {
  if (!cell.constructionStartTime) return true;
  const building = getBuildingByEmoji(cell.content);
  if (!building) return true;
  
  const constructionEndTime = cell.constructionStartTime + building.constructionTime;
  return Date.now() >= constructionEndTime;
}

export function canUpgradeBuilding(
  cell: Cell,
  grid: Cell[][]
): BuildingOption | null {
  const currentBuilding = getBuildingByEmoji(cell.content);
  if (!currentBuilding?.upgrades?.length) return null;
  
  const possibleUpgrade = currentBuilding.upgrades.find(upgrade => {
    const upgradeTo = getBuildingById(upgrade.to);
    return upgradeTo && canPlaceBuilding(upgradeTo, grid, 0, 0);
  });
  
  return possibleUpgrade ? getBuildingById(possibleUpgrade.to) : null;
}

export function getBuildingById(id: string): BuildingOption | undefined {
  // Try cache first
  const cached = buildingCache.getBuilding(id);
  if (cached) return cached;

  // If not in cache, get from options and cache it
  const building = BUILDING_OPTIONS.find(b => b.id === id);
  if (building) {
    buildingCache.setBuilding(building);
  }
  return building;
}

export function getBuildingByEmoji(emoji: string | null): BuildingOption | undefined {
  return BUILDING_OPTIONS.find(b => b.emoji === emoji);
}

export const BUILDING_OPTIONS: BuildingOption[] = [
  {
    id: 'rocket',
    emoji: '🚀',
    name: 'Rocket',
    category: 'basic',
    health: 100,
    attack: 50,
    constructionTime: 5000,
    level: 1,
    size: { width: 1, height: 1 },
    upgrades: [
      { to: 'advanced-rocket', cost: 100 }
    ]
  },
  {
    id: 'building',
    emoji: '🏢',
    name: 'Building',
    category: 'basic',
    health: 150,
    attack: 20,
    constructionTime: 3000,
    size: { width: 1, height: 1 },
    level: 1
  },
  {
    id: 'factory',
    emoji: '🏭',
    name: 'Factory',
    category: 'advanced',
    health: 200,
    attack: 30,
    constructionTime: 4000,
    level: 1,
    size: { width: 1, height: 1 },
    requirements: ['powerplant']
  },
  {
    id: 'house',
    emoji: '🏠',
    name: 'House',
    category: 'basic',
    health: 80,
    attack: 20,
    constructionTime: 2000,
    level: 1,
    size: { width: 1, height: 1 },
    upgrades: [
      { to: 'building', cost: 50 }
    ]
  },
  {
    id: 'powerplant',
    emoji: '⚡',
    name: 'Power Plant',
    category: 'basic',
    health: 120,
    attack: 40,
    constructionTime: 6000,
    size: { width: 1, height: 1 },
    level: 1
  },
  {
    id: 'advanced-rocket',
    emoji: '🛸',
    name: 'Advanced Rocket',
    category: 'advanced',
    health: 200,
    attack: 80,
    constructionTime: 8000,
    level: 2,
    size: { width: 1, height: 1 },
    requirements: ['factory']
  },
  {
    id: 'hospital',
    emoji: '🏥',
    name: 'Hospital',
    category: 'special',
    health: 200,
    attack: 10,
    constructionTime: 7000,
    size: { width: 2, height: 2 },
    level: 1,
    ability: {
      name: 'Heal',
      description: 'Heals adjacent buildings',
      effect: 'heal'
    }
  },
  {
    id: 'school',
    emoji: '🏫',
    name: 'School',
    category: 'special',
    health: 150,
    attack: 15,
    constructionTime: 6000,
    size: { width: 2, height: 1 },
    level: 1,
    ability: {
      name: 'Boost',
      description: 'Increases adjacent buildings attack',
      effect: 'boost'
    }
  },
  {
    id: 'shopping-center',
    emoji: '🏬',
    name: 'Shopping Center',
    category: 'special',
    health: 180,
    attack: 20,
    constructionTime: 8000,
    size: { width: 2, height: 2 },
    level: 1,
    ability: {
      name: 'Generate',
      description: 'Generates resources each turn',
      effect: 'generate'
    }
  },
  {
    id: 'bank',
    emoji: '🏦',
    name: 'Bank',
    category: 'special',
    health: 250,
    attack: 30,
    constructionTime: 9000,
    size: { width: 1, height: 2 },
    level: 1,
    ability: {
      name: 'Protect',
      description: 'Increases adjacent buildings health',
      effect: 'protect'
    }
  },
  {
    id: 'entertainment',
    emoji: '🏟️',
    name: 'Entertainment',
    category: 'special',
    health: 160,
    attack: 25,
    constructionTime: 7000,
    size: { width: 2, height: 2 },
    level: 1,
    ability: {
      name: 'Boost',
      description: 'Boosts all nearby buildings',
      effect: 'boost'
    }
  }
];