import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../interfaces/extended-request.interface';
import { WorkspaceEntity } from '../entities/workspace.entity';

export const Workspace = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkspaceEntity => {
    const req = ctx.switchToHttp().getRequest<ExtendedRequest>();
    return req.workspace;
  },
);
