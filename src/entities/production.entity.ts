import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';
import { ConsumptionEntity } from './consumption.entity';

@Entity({
  name: 'production',
})
export class ProductionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workspaceId: number;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @Column()
  name: string;

  @Column()
  productionQuantity: number;

  @Column()
  targetQuantity: number;

  @Column({ default: 1 })
  productionLines: number;

  @Column()
  productionTime: number;

  @OneToMany(() => ConsumptionEntity, (c) => c.production)
  consumptions: ConsumptionEntity[];

  @OneToMany(() => ConsumptionEntity, (c) => c.consumedProduction)
  consumedBy: ConsumptionEntity[];

  @CreateDateColumn()
  created_at: Date;
}
