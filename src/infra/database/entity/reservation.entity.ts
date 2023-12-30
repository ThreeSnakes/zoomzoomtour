import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Tour } from './tour.entity';

@Entity('RESERVATION')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({
    name: 'client_id',
  })
  client?: Promise<Client>;

  @ManyToOne(() => Tour, (tour) => tour.id)
  @JoinColumn({
    name: 'tour_id',
  })
  tour?: Promise<Tour>;

  @Column({ length: 10 })
  state: string;
}
