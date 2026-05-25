import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductionEntity } from './production.entity';

@Entity({
  name: 'consumption',
})
export class ConsumptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productionId: number;

  @ManyToOne(() => ProductionEntity, (p) => p.consumptions)
  @JoinColumn({ name: 'production_id' })
  production: ProductionEntity;

  @Column({ nullable: true, type: 'int' })
  consumedProductionId: number | null;

  @ManyToOne(() => ProductionEntity, (p) => p.consumedBy, { nullable: true })
  @JoinColumn({ name: 'consumed_production_id' })
  consumedProduction: ProductionEntity | null;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;
}
