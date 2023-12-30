import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('CLIENT')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.client)
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
