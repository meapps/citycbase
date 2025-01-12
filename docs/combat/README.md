# Combat System Documentation

## Overview
The combat system is turn-based and operates on a grid where buildings can attack adjacent cells. Combat occurs during the Attack Phase and involves automatic resolution of all attacks.

## Core Mechanics

### Attack Resolution
```typescript
interface CombatResult {
  damage: number;
  attacker: { row: number; col: number };
  target: { row: number; col: number };
}
```

1. **Target Selection**
   - Buildings attack orthogonally adjacent cells
   - Random target selection when multiple targets
   - No diagonal attacks
   - Cannot attack empty cells

2. **Damage Calculation**
   - Base damage = attacker's ATK value
   - Modified by abilities and buffs
   - No damage reduction by default
   - Critical hits possible with abilities

3. **Combat Resolution Order**
   - All attacks calculated simultaneously
   - Damage applied after all calculations
   - Destroyed buildings removed last
   - Animations played sequentially

### Special Abilities

#### Healing
```typescript
function processHealing(cell: Cell, adjacentCells: Cell[]) {
  // Heal 20% of max HP
  const healAmount = Math.floor(cell.health * 0.2);
  adjacentCells.forEach(target => {
    target.health = Math.min(
      target.health + healAmount,
      target.maxHealth
    );
  });
}
```

#### Attack Boost
```typescript
function processBoost(cell: Cell, adjacentCells: Cell[]) {
  // Boost attack by 20%
  adjacentCells.forEach(target => {
    target.attack = Math.floor(target.attack * 1.2);
  });
}
```

### Combat Animations

#### Animation System
```typescript
interface CombatAnimation {
  type: 'attack' | 'heal' | 'boost';
  source: Position;
  target: Position;
  duration: number;
  damage?: number;
}
```

1. **Animation Queue**
   - Animations played sequentially
   - Each animation has fixed duration
   - Can be interrupted by phase change
   - Visual feedback matches action

2. **Visual Effects**
   - Attack: Red projectile
   - Heal: Green particles
   - Boost: Blue aura
   - Destruction: Explosion

### Combat Strategy

#### Offensive Tactics
1. **Building Placement**
   - Place high ATK buildings centrally
   - Protect vulnerable buildings
   - Create attack chains
   - Control choke points

2. **Ability Synergies**
   - Combine boost effects
   - Chain healing buildings
   - Focus fire strategies
   - Resource denial

#### Defensive Tactics
1. **Building Protection**
   - Use high HP buildings as shields
   - Create healing networks
   - Maintain escape routes
   - Buffer zones

2. **Counter-Attack**
   - Reactive placement
   - Ability timing
   - Resource management
   - Zone control