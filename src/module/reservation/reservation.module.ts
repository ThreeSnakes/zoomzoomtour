import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from '../../infra/database/entity/reservation.entity';
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { ClientEntity } from '../../infra/database/entity/client.entity';
import { ReservationCacheModule } from '../reservationCache/reservationCache.module';
import { CreateNewReservationService } from './service/createNewReservation.service';
import { ApproveWaitReservationService } from './service/approveWaitReservation.service';
import { CancelReservationService } from './service/cancelReservation.service';

@Module({
  controllers: [ReservationController],
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, ClientEntity, TourEntity]),
    ReservationCacheModule,
  ],
  providers: [
    CancelReservationService,
    CreateNewReservationService,
    ApproveWaitReservationService,
  ],
})
export class ReservationModule {}
