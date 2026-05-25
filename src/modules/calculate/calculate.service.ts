import { Injectable } from '@nestjs/common';
import { ProductionEntity } from '../../entities/production.entity';

interface Requirement {
  productionId: number;
  quantity: number;
}

interface Recipe {
  productionId: number;
  name: string;
  productionQuantity: number;
  targetQuantity: number;
  productionTime: number;
  productionLines: number;
  requirements: Requirement[];
}

interface Task {
  productionId: number;
  name: string;
  quantity: number;
  time: number;
  startTime?: number;
  endTime?: number;
  dependsOn?: Task[];
  requiredBy?: Task[];
}

interface ScheduledLine {
  productionId: number;
  name: string;
  endOfLastTask: number;
  tasks: Task[];
}

export interface CalculationResult {
  lines: {
    productionId: number;
    name: string;
    tasks: {
      productionId: number;
      name: string;
      quantity: number;
      startTime: number;
      endTime: number;
    }[];
  }[];
}

@Injectable()
export class CalculateService {
  async calculate(workspaceId: number): Promise<CalculationResult> {
    const productions = await ProductionEntity.find({
      where: { workspaceId },
      relations: { consumptions: true },
    });

    const recipes: Recipe[] = productions
      .filter((p) => p.productionQuantity > 0 && p.name)
      .map((p) => ({
        productionId: p.id,
        name: p.name,
        productionQuantity: Number(p.productionQuantity),
        targetQuantity: Number(p.targetQuantity),
        productionTime: Number(p.productionTime) || 1,
        productionLines: p.productionLines || 1,
        requirements: (p.consumptions || [])
          .filter(
            (c) => c.consumedProductionId != null && Number(c.quantity) > 0,
          )
          .map((c) => ({
            productionId: c.consumedProductionId as number,
            quantity: Number(c.quantity),
          })),
      }));

    if (recipes.length === 0) return { lines: [] };

    const recipeById = new Map<number, Recipe>();
    for (const r of recipes) recipeById.set(r.productionId, r);

    const scheduledLines: ScheduledLine[] = [];
    for (const r of recipes) {
      for (let i = 0; i < r.productionLines; i++) {
        scheduledLines.push({
          productionId: r.productionId,
          name: r.name,
          endOfLastTask: 0,
          tasks: [],
        });
      }
    }

    let currentTasks: Task[] = recipes.flatMap((r) => {
      const chunks: Task[] = [];
      let remaining = r.targetQuantity;
      while (remaining > 0) {
        const qty = Math.min(remaining, 5);
        chunks.push({
          productionId: r.productionId,
          name: r.name,
          quantity: qty,
          time: (r.productionTime * qty) / r.productionQuantity,
        });
        remaining -= qty;
      }
      return chunks;
    });

    const allTasks: Task[] = [];
    while (currentTasks.length) {
      allTasks.push(...currentTasks);
      const nextTasks: Task[] = [];
      for (const t of currentTasks) {
        const r = recipeById.get(t.productionId);
        if (!r) continue;
        const iterations = t.quantity / r.productionQuantity;
        t.time = r.productionTime * iterations;
        const subTasks: Task[] = [];
        for (const rq of r.requirements) {
          const subRecipe = recipeById.get(rq.productionId);
          if (!subRecipe) continue;
          subTasks.push({
            productionId: rq.productionId,
            name: subRecipe.name,
            quantity: rq.quantity * iterations,
            time: r.productionTime * iterations,
          });
        }
        t.dependsOn = subTasks;
        for (const sub of subTasks) {
          sub.requiredBy = sub.requiredBy || [];
          sub.requiredBy.push(t);
        }
        nextTasks.push(...subTasks);
      }
      currentTasks = nextTasks;
    }

    const forwardTasks = [...allTasks].reverse();
    const linesByProduction = new Map<number, ScheduledLine[]>();
    for (const line of scheduledLines) {
      const arr = linesByProduction.get(line.productionId) ?? [];
      arr.push(line);
      linesByProduction.set(line.productionId, arr);
    }

    for (const item of forwardTasks) {
      const pl = linesByProduction.get(item.productionId);
      if (!pl || pl.length === 0) continue;

      let depMaxEnd = 0;
      if (item.dependsOn) {
        for (const dep of item.dependsOn) {
          if (dep.endTime != null && dep.endTime > depMaxEnd) {
            depMaxEnd = dep.endTime;
          }
        }
      }

      let min = pl[0];
      for (const line of pl) {
        if (line.endOfLastTask < min.endOfLastTask) min = line;
      }

      item.startTime = Math.max(depMaxEnd, min.endOfLastTask);
      item.endTime = item.startTime + item.time;
      min.endOfLastTask = item.endTime;
      min.tasks.push(item);
    }

    return {
      lines: scheduledLines.map((l) => ({
        productionId: l.productionId,
        name: l.name,
        tasks: l.tasks.map((t) => ({
          productionId: t.productionId,
          name: t.name,
          quantity: t.quantity,
          startTime: t.startTime ?? 0,
          endTime: t.endTime ?? 0,
        })),
      })),
    };
  }
}
