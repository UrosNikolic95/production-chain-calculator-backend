import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import { CreateWorkspaceDto } from '../../dtos/workspace.dto';

@Injectable()
export class WorkspaceService {
  list(userId: number) {
    return WorkspaceEntity.find({
      where: { userId },
      order: { id: 'ASC' },
    });
  }

  async create(userId: number, dto: CreateWorkspaceDto) {
    const entity = WorkspaceEntity.create({
      userId,
      name: dto.name?.trim() || 'new workspace',
    });
    await entity.save();
    return entity;
  }

  async assertOwned(userId: number, id: number) {
    const workspace = await WorkspaceEntity.findOne({
      where: { id, userId },
    });
    if (!workspace) throw new NotFoundException();
    return workspace;
  }
}
