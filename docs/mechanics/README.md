# Game Mechanics Documentation

## Core Game Loop

### Phases
1. **Planning Phase** 🎯
   - Place new buildings
   - Remove existing buildings
   - Upgrade buildings
   - Clear grid if needed

2. **Attack Phase** ⚔️
   - Buildings attack adjacent cells
   - Damage calculation
   - Combat animations
   - Building destruction

3. **Defense Phase** 🛡️
   - Review combat results
   - Plan next turn strategy

### Building System

#### Building Types
Each building has the following properties:
- `health`: Building durability
- `attack`: Damage dealt to adjacent buildings
- `constructionTime`: Time to build
- `level`: Building tier
- `size`: Grid cells occupied
- `requirements`: Required buildings
- `upgrades`: Available upgrades

#### Construction
- Buildings take time to construct
- Construction progress is visible
- Cannot be attacked during construction
- Requirements must be met

#### Upgrades
- Buildings can be upgraded to stronger versions
- Upgrades require resources
- Upgrades maintain position
- Some upgrades change building size

### Combat System

#### Attack Resolution
1. Buildings attack simultaneously
2. Damage is applied to adjacent cells
3. Buildings are destroyed at 0 HP
4. Special abilities trigger
5. Combat animations play

#### Special Abilities
- Heal: Restore HP to adjacent buildings
- Boost: Increase adjacent attack power
- Generate: Produce resources
- Protect: Increase adjacent defense

### Resource Management

#### Resources
- Gold: Building and upgrades
- Energy: Special abilities
- Population: Victory condition

#### Generation
- Buildings generate resources
- Special buildings boost generation
- Resource caps based on buildings