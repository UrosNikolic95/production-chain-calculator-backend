import { Controller, Post, UseGuards } from '@nestjs/common';
import { AnonymousUserGuard } from '../../guards/anonymous-user.guard';
import { Workspace } from '../../decorators/workspace.decorator';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import { CalculateService } from './calculate.service';

@UseGuards(AnonymousUserGuard)
@Controller('calculate')
export class CalculateController {
  constructor(private readonly service: CalculateService) {}

  @Post()
  run(@Workspace() workspace: WorkspaceEntity) {
    return this.service.calculate(workspace.id);
  }
}
