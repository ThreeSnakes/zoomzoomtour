import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourEntity } from './tour.entity';
import { BaseEntity } from './base.entity';

@Entity('HOLIDAY')
export class HolidayEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TourEntity, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<TourEntity>;

  @Column({
    length: 10,
    nullable: false,
  })
  date: string;
}
