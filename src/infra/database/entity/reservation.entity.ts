import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Tour } from './tour.entity';

export enum RESERVATION_STATE {
  WAIT = 0, // 대기
  APPROVE = 1, // 승인
}

@Entity('RESERVATION')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({
    name: 'client_id',
  })
  client?: Promise<Awaited<Client>>;

  @ManyToOne(() => Tour, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<Awaited<Tour>>;

  @Column({
    default: RESERVATION_STATE.WAIT,
  })
  state: RESERVATION_STATE;
}
