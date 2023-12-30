import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tour } from './tour.entity';
import { DAY_OF_WEEK } from '../../../module/tour/dto/api/CreateTour.dto';

@Entity('REGULAR_HOLIDAY')
export class RegularHoliday {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tour, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<Tour>;

  @Column({
    nullable: false,
  })
  day: DAY_OF_WEEK;

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