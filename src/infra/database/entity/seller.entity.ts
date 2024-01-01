import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TourEntity } from './tour.entity';
import { BaseEntity } from './base.entity';

@Entity('SELLER')
export class SellerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @OneToMany(() => TourEntity, (tour) => tour.id)
  tours: Promise<TourEntity[]>;
}
