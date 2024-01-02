import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';
import { TourEntity } from './tour.entity';
import { RESERVATION_STATE } from '../../../module/reservation/domain/reservation.domain';
import { BaseEntity } from './base.entity';

@Entity('RESERVATION')
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({
    name: 'client_id',
  })
  client?: Promise<Awaited<ClientEntity>>;

  @ManyToOne(() => TourEntity, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<Awaited<TourEntity>>;

  @Column({
    default: 'WAIT',
  })
  state: RESERVATION_STATE;

  @Column({
    type: 'timestamp',
    precision: 0,
    nullable: false,
  })
  date: Date;
}
