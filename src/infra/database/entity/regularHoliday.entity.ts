import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourEntity } from './tour.entity';
import { DAY_OF_WEEK } from '../../../module/tour/domain/regularHoliday.domain';
import { BaseEntity } from './base.entity';

@Entity('REGULAR_HOLIDAY')
export class RegularHolidayEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TourEntity, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<TourEntity>;

  @Column({
    nullable: false,
  })
  day: DAY_OF_WEEK;
}
