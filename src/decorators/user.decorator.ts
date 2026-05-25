import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../interfaces/extended-request.interface';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest<ExtendedRequest>();
    return req.user;
  },
);
