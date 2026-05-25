import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductionEntity } from '../../entities/production.entity';
import {
  CreateProductionDto,
  UpdateProductionDto,
} from '../../dtos/production.dto';

@Injectable()
export class ProductionService {
  list(workspaceId: number) {
    return ProductionEntity.find({
      where: { workspaceId },
      relations: { consumptions: true },
      order: { id: 'ASC' },
    });
  }

  async create(workspaceId: number, dto: CreateProductionDto) {
    const entity = ProductionEntity.create({
      workspaceId,
      name: dto.name ?? '',
      productionQuantity: dto.productionQuantity ?? 0,
      targetQuantity: dto.targetQuantity ?? 0,
      productionLines: dto.productionLines ?? 1,
      productionTime: dto.productionTime ?? 0,
    });
    await entity.save();
    return entity;
  }

  async update(workspaceId: number, id: number, dto: UpdateProductionDto) {
    const entity = await ProductionEntity.findOne({
      where: { id, workspaceId },
    });
    if (!entity) throw new NotFoundException();
    Object.assign(entity, dto);
    await entity.save();
    return entity;
  }

  async remove(workspaceId: number, id: number) {
    const entity = await ProductionEntity.findOne({
      where: { id, workspaceId },
    });
    if (!entity) throw new NotFoundException();
    await entity.remove();
  }
}
