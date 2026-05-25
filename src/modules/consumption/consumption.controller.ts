import {
  Body,
  Controller,
  Delete,
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
  CreateConsumptionDto,
  UpdateConsumptionDto,
} from '../../dtos/consumption.dto';
import { ConsumptionService } from './consumption.service';

@UseGuards(AnonymousUserGuard)
@Controller('consumptions')
export class ConsumptionController {
  constructor(private readonly service: ConsumptionService) {}

  @Post()
  create(
    @Workspace() workspace: WorkspaceEntity,
    @Body() dto: CreateConsumptionDto,
  ) {
    return this.service.create(workspace.id, dto);
  }

  @Patch(':id')
  update(
    @Workspace() workspace: WorkspaceEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsumptionDto,
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
