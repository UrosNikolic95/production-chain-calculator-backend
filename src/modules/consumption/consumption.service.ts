import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductionEntity } from '../../entities/production.entity';
import { ConsumptionEntity } from '../../entities/consumption.entity';
import {
  CreateConsumptionDto,
  UpdateConsumptionDto,
} from '../../dtos/consumption.dto';

@Injectable()
export class ConsumptionService {
  private async assertProductionOwned(workspaceId: number, id: number) {
    const production = await ProductionEntity.findOne({
      where: { id, workspaceId },
    });
    if (!production) throw new ForbiddenException();
    return production;
  }

  async create(workspaceId: number, dto: CreateConsumptionDto) {
    await this.assertProductionOwned(workspaceId, dto.productionId);
    if (dto.consumedProductionId != null) {
      await this.assertProductionOwned(workspaceId, dto.consumedProductionId);
    }
    const entity = ConsumptionEntity.create({
      productionId: dto.productionId,
      consumedProductionId: dto.consumedProductionId ?? null,
      quantity: dto.quantity ?? 0,
    });
    await entity.save();
    return entity;
  }

  async update(workspaceId: number, id: number, dto: UpdateConsumptionDto) {
    const entity = await ConsumptionEntity.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    await this.assertProductionOwned(workspaceId, entity.productionId);
    if (dto.consumedProductionId != null) {
      await this.assertProductionOwned(workspaceId, dto.consumedProductionId);
    }
    Object.assign(entity, dto);
    await entity.save();
    return entity;
  }

  async remove(workspaceId: number, id: number) {
    const entity = await ConsumptionEntity.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    await this.assertProductionOwned(workspaceId, entity.productionId);
    await entity.remove();
  }
}
