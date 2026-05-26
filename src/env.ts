import * as dotenv from 'dotenv';
import { EnvDecorators } from './decorators/env.decorators';
dotenv.config();

export class EnvVariables {
  @EnvDecorators.String()
  NODE_ENV: string;

  @EnvDecorators.String({ required: true })
  POSTGRES_DB: string;

  @EnvDecorators.String({ required: true })
  POSTGRES_USER: string;

  @EnvDecorators.String({ required: true })
  POSTGRES_PASSWORD: string;

  @EnvDecorators.Boolean()
  RUN_MIGRATIONS_DB = false;

  @EnvDecorators.Boolean()
  SYNCHRONIZE_DB = false;

  get IS_LOCAL() {
    return this.NODE_ENV == 'local';
  }

  get IS_PRODUCTION() {
    return this.NODE_ENV == 'production';
  }

  get IS_DEVELOPMENT() {
    return this.NODE_ENV == 'development';
  }

  get DATABASE_DOMAIN() {
    return this.IS_PRODUCTION ? 'db' : 'localhost';
  }

  get DB_URL(): string {
    const domain = this.DATABASE_DOMAIN;
    return `postgres://${this.POSTGRES_USER}:${this.POSTGRES_PASSWORD}@${domain}:5432/${this.POSTGRES_DB}`;
  }

  @EnvDecorators.Boolean()
  PRINT_ENV_EXAMPLE: boolean;

  @EnvDecorators.String({ required: true })
  USER_COOKIE: string = 'session';

  @EnvDecorators.String({ required: true })
  ACTIVE_WORKSPACE_COOKIE: string = 'active_workspace';

  @EnvDecorators.Int({ required: true })
  COOKIE_MAX_AGE_MS: number = 1000_000;
}

export const envConfig = EnvDecorators.init(EnvVariables);
if (envConfig.PRINT_ENV_EXAMPLE) EnvDecorators.PrintEnvExample();
