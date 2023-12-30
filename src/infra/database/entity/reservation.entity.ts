import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Tour } from './tour.entity';

export enum RESERVATION_STATE {
  WAIT = 0, // 대기
  APPROVE = 1, // 승인,
}

@Entity('RESERVATION')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  token: string;

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
