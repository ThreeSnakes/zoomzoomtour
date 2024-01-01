import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { BaseEntity } from './base.entity';

@Entity('CLIENT')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.client)
  reservation: Promise<Awaited<ReservationEntity[]>>;
}
