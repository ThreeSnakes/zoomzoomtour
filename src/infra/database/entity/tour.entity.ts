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
import { Seller } from './seller.entity';
import { RegularHoliday } from './regularHoliday.entity';
import { Holiday } from './holiday.entity';
import { Reservation } from './reservation.entity';

@Entity('TOUR')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seller, (seller) => seller.tours)
  @JoinColumn({
    name: 'seller_id',
  })
  seller?: Promise<Seller>;

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

  @OneToMany(() => RegularHoliday, (regularHoliday) => regularHoliday.id)
  regularHoliday?: Promise<Awaited<RegularHoliday[]>>;

  @OneToMany(() => Holiday, (holiday) => holiday.id)
  holiday?: Promise<Awaited<Holiday[]>>;

  @OneToMany(() => Reservation, (reservation) => reservation.tour)
  reservation: Promise<Awaited<Reservation[]>>;

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
