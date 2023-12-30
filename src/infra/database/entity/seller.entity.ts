import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TourEntity } from './tour.entity';

@Entity('SELLER')
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @OneToMany(() => TourEntity, (tour) => tour.id)
  tours: Promise<TourEntity[]>;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  ctime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  mtime: Date;
}
