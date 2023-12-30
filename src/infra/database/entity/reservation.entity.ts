import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';
import { TourEntity } from './tour.entity';

export enum RESERVATION_STATE {
  WAIT = 0, // 대기
  APPROVE = 1, // 승인,
}

@Entity('RESERVATION')
export class ReservationEntity {
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
    default: RESERVATION_STATE.WAIT,
  })
  state: RESERVATION_STATE;

  @Column({
    nullable: false,
  })
  date: string;

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
