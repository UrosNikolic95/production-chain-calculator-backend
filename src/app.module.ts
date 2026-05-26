import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './env';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { UserEntity } from './entities/user.entity';
import { WorkspaceEntity } from './entities/workspace.entity';
import { ProductionEntity } from './entities/production.entity';
import { ConsumptionEntity } from './entities/consumption.entity';
import { ProductionModule } from './modules/production/production.module';
import { ConsumptionModule } from './modules/consumption/consumption.module';
import { CalculateModule } from './modules/calculate/calculate.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envConfig.DB_URL,
      entities: [
        UserEntity,
        WorkspaceEntity,
        ProductionEntity,
        ConsumptionEntity,
      ],
      synchronize: envConfig.SYNCHRONIZE_DB,
      migrationsRun: envConfig.RUN_MIGRATIONS_DB,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    }),
    ProductionModule,
    ConsumptionModule,
    CalculateModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
