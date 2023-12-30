import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../../infra/database/entity/reservation.entity';
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Tour } from '../../infra/database/entity/tour.entity';
import { Client } from '../../infra/database/entity/client.entity';

@Module({
  controllers: [ReservationController],
  imports: [TypeOrmModule.forFeature([Reservation, Client, Tour])],
  providers: [ReservationService],
})
export class ReservationModule {}
