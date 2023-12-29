import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SELLER')
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
}
