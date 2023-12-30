import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellerEntity } from './seller.entity';
import { RegularHolidayEntity } from './regularHoliday.entity';
import { HolidayEntity } from './holiday.entity';
import { ReservationEntity } from './reservation.entity';

@Entity('TOUR')
export class TourEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SellerEntity, (seller) => seller.tours)
  @JoinColumn({
    name: 'seller_id',
  })
  seller?: Promise<SellerEntity>;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    length: 200,
    nullable: false,
  })
  description: string;

  @OneToMany(() => RegularHolidayEntity, (regularHoliday) => regularHoliday.id)
  regularHoliday?: Promise<Awaited<RegularHolidayEntity[]>>;

  @OneToMany(() => HolidayEntity, (holiday) => holiday.id)
  holiday?: Promise<Awaited<HolidayEntity[]>>;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.tour)
  reservation: Promise<Awaited<ReservationEntity[]>>;

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
