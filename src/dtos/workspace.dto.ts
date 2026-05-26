import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}

export class SelectWorkspaceDto {
  @IsInt()
  id: number;
}
