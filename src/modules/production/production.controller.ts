import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnonymousUserGuard } from '../../guards/anonymous-user.guard';
import { Workspace } from '../../decorators/workspace.decorator';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import {
  CreateProductionDto,
  UpdateProductionDto,
} from '../../dtos/production.dto';
import { ProductionService } from './production.service';

@UseGuards(AnonymousUserGuard)
@Controller('productions')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}

  @Get()
  list(@Workspace() workspace: WorkspaceEntity) {
    return this.service.list(workspace.id);
  }

  @Post()
  create(
    @Workspace() workspace: WorkspaceEntity,
    @Body() dto: CreateProductionDto,
  ) {
    return this.service.create(workspace.id, dto);
  }

  @Patch(':id')
  update(
    @Workspace() workspace: WorkspaceEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductionDto,
  ) {
    return this.service.update(workspace.id, id, dto);
  }

  @Delete(':id')
  remove(
    @Workspace() workspace: WorkspaceEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(workspace.id, id);
  }
}
