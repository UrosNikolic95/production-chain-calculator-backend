import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { envConfig } from '../env';
import { ExtendedRequest } from '../interfaces/extended-request.interface';
import { seedTankProductionChain } from '../seed/tank-production-chain.seed';

@Injectable()
export class AnonymousUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();
    const res = context.switchToHttp().getResponse<Response>();

    const token = req.cookies?.[envConfig.USER_COOKIE] as string | undefined;
    let user = token ? await UserEntity.findOne({ where: { token } }) : null;

    if (!user) {
      user = UserEntity.create({ token: randomUUID() });
      await user.save();
      res.cookie(envConfig.USER_COOKIE, user.token, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    const activeId = Number(
      req.cookies?.[envConfig.ACTIVE_WORKSPACE_COOKIE] as string | undefined,
    );
    let workspace = activeId
      ? await WorkspaceEntity.findOne({
          where: { id: activeId, userId: user.id },
        })
      : null;
    if (!workspace) {
      workspace = await WorkspaceEntity.findOne({
        where: { userId: user.id },
        order: { id: 'ASC' },
      });
    }
    if (!workspace) {
      workspace = await seedTankProductionChain(user.id);
    }

    req.user = user;
    req.workspace = workspace;
    return true;
  }
}
