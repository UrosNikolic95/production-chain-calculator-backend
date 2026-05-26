import { WorkspaceEntity } from '../entities/workspace.entity';
import { ProductionEntity } from '../entities/production.entity';
import { ConsumptionEntity } from '../entities/consumption.entity';

interface SeedConsumption {
  name: string;
  quantity: number;
}

interface SeedProduction {
  name: string;
  productionQuantity: number;
  targetQuantity: number;
  productionLines: number;
  productionTime: number;
  consumes: SeedConsumption[];
}

export const TANK_WORKSPACE_NAME = 'tank production chain';

// Mirrors the example seeded in practice-4/main.js (addRow calls):
// addRow(quantity, type, targetQuantity, lines, time, consumed[[qty, type], ...])
const TANK_PRODUCTION_CHAIN: SeedProduction[] = [
  // Level 0 — final product
  {
    name: 'Tank',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 1,
    productionTime: 10,
    consumes: [
      { name: 'Hull', quantity: 1 },
      { name: 'Turret', quantity: 1 },
      { name: 'Engine', quantity: 1 },
      { name: 'Tracks', quantity: 2 },
    ],
  },
  // Level 1 — major assemblies
  {
    name: 'Hull',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 2,
    productionTime: 6,
    consumes: [
      { name: 'Steel Plate', quantity: 5 },
      { name: 'Armor Plate', quantity: 2 },
    ],
  },
  {
    name: 'Turret',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 1,
    productionTime: 5,
    consumes: [
      { name: 'Steel Plate', quantity: 3 },
      { name: 'Gun Barrel', quantity: 1 },
    ],
  },
  {
    name: 'Engine',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 2,
    productionTime: 8,
    consumes: [
      { name: 'Steel Plate', quantity: 4 },
      { name: 'Gearbox', quantity: 1 },
    ],
  },
  {
    name: 'Tracks',
    productionQuantity: 2,
    targetQuantity: 6,
    productionLines: 3,
    productionTime: 4,
    consumes: [
      { name: 'Steel Link', quantity: 10 },
      { name: 'Rubber Pad', quantity: 4 },
    ],
  },
  // Level 2 — manufactured parts
  {
    name: 'Steel Plate',
    productionQuantity: 5,
    targetQuantity: 40,
    productionLines: 4,
    productionTime: 2,
    consumes: [{ name: 'Raw Steel', quantity: 8 }],
  },
  {
    name: 'Armor Plate',
    productionQuantity: 2,
    targetQuantity: 6,
    productionLines: 2,
    productionTime: 3,
    consumes: [{ name: 'Raw Steel', quantity: 5 }],
  },
  {
    name: 'Gun Barrel',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 1,
    productionTime: 4,
    consumes: [{ name: 'Steel Plate', quantity: 2 }],
  },
  {
    name: 'Gearbox',
    productionQuantity: 1,
    targetQuantity: 3,
    productionLines: 1,
    productionTime: 6,
    consumes: [{ name: 'Steel Plate', quantity: 3 }],
  },
  // Level 3 — raw materials (no inputs)
  {
    name: 'Raw Steel',
    productionQuantity: 10,
    targetQuantity: 80,
    productionLines: 5,
    productionTime: 1,
    consumes: [],
  },
  {
    name: 'Steel Link',
    productionQuantity: 20,
    targetQuantity: 30,
    productionLines: 2,
    productionTime: 2,
    consumes: [],
  },
  {
    name: 'Rubber Pad',
    productionQuantity: 10,
    targetQuantity: 20,
    productionLines: 2,
    productionTime: 2,
    consumes: [],
  },
];

/**
 * Creates the "tank production chain" workspace for a user and seeds it with
 * the example production chain from practice-4/main.js.
 */
export async function seedTankProductionChain(
  userId: number,
): Promise<WorkspaceEntity> {
  const workspace = WorkspaceEntity.create({
    userId,
    name: TANK_WORKSPACE_NAME,
  });
  await workspace.save();

  // Create every production first so consumptions can reference them by id.
  const productionsByName = new Map<string, ProductionEntity>();
  for (const seed of TANK_PRODUCTION_CHAIN) {
    const production = ProductionEntity.create({
      workspaceId: workspace.id,
      name: seed.name,
      productionQuantity: seed.productionQuantity,
      targetQuantity: seed.targetQuantity,
      productionLines: seed.productionLines,
      productionTime: seed.productionTime,
    });
    await production.save();
    productionsByName.set(seed.name, production);
  }

  // Link consumptions between the seeded productions.
  for (const seed of TANK_PRODUCTION_CHAIN) {
    const production = productionsByName.get(seed.name)!;
    for (const consumed of seed.consumes) {
      const consumedProduction = productionsByName.get(consumed.name) ?? null;
      const consumption = ConsumptionEntity.create({
        productionId: production.id,
        consumedProductionId: consumedProduction?.id ?? null,
        quantity: consumed.quantity,
      });
      await consumption.save();
    }
  }

  return workspace;
}
