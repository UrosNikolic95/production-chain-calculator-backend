import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AnonymousUserGuard } from '../../guards/anonymous-user.guard';
import { Workspace } from '../../decorators/workspace.decorator';
import { User } from '../../decorators/user.decorator';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import { UserEntity } from '../../entities/user.entity';
import {
  CreateWorkspaceDto,
  SelectWorkspaceDto,
} from '../../dtos/workspace.dto';
import { WorkspaceService } from './workspace.service';
import { envConfig } from '../../env';

@UseGuards(AnonymousUserGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly service: WorkspaceService) {}

  @Get()
  list(@User() user: UserEntity) {
    return this.service.list(user.id);
  }

  @Get('current')
  current(@Workspace() workspace: WorkspaceEntity) {
    return workspace;
  }

  @Post()
  async create(
    @User() user: UserEntity,
    @Body() dto: CreateWorkspaceDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const workspace = await this.service.create(user.id, dto);
    this.setActiveCookie(res, workspace.id);
    return workspace;
  }

  @Post('select')
  async select(
    @User() user: UserEntity,
    @Body() dto: SelectWorkspaceDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const workspace = await this.service.assertOwned(user.id, dto.id);
    this.setActiveCookie(res, workspace.id);
    return workspace;
  }

  private setActiveCookie(res: Response, workspaceId: number) {
    res.cookie(envConfig.ACTIVE_WORKSPACE_COOKIE, String(workspaceId), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: envConfig.COOKIE_MAX_AGE_MS,
    });
  }
}
