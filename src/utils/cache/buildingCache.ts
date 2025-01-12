import { BuildingOption } from '../../types';
import { assetCache } from './assetCache';

export const buildingCache = {
  getBuilding(id: string): BuildingOption | null {
    return assetCache.get<BuildingOption>(`building:${id}`);
  },

  setBuilding(building: BuildingOption): void {
    assetCache.set(`building:${building.id}`, building);
  },

  clearBuildingCache(): void {
    assetCache.clear();
  }
};