import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SellerEntity } from './seller.entity';
import { RegularHolidayEntity } from './regularHoliday.entity';
import { HolidayEntity } from './holiday.entity';
import { ReservationEntity } from './reservation.entity';
import { BaseEntity } from './base.entity';

@Entity('TOUR')
export class TourEntity extends BaseEntity {
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

  @OneToMany(
    () => RegularHolidayEntity,
    (regularHoliday) => regularHoliday.tour,
  )
  regularHoliday?: Promise<Awaited<RegularHolidayEntity[]>>;

  @OneToMany(() => HolidayEntity, (holiday) => holiday.tour)
  holiday?: Promise<Awaited<HolidayEntity[]>>;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.tour)
  reservation: Promise<Awaited<ReservationEntity[]>>;
}
