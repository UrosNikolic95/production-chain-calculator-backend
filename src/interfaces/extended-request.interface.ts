import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';
import { WorkspaceEntity } from '../entities/workspace.entity';

export interface ExtendedRequest extends Request {
  user: UserEntity;
  workspace: WorkspaceEntity;
}
