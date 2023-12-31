import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { ReservationCacheModule } from '../reservationCache/reservationCache.module';
import { DayjsHelperModule } from '../helper/dayjsHelper/dayjsHelper.module';

@Module({
  controllers: [TourController],
  imports: [
    TypeOrmModule.forFeature([TourEntity, SellerEntity]),
    ReservationCacheModule,
    DayjsHelperModule,
  ],
  providers: [TourService],
})
export class TourModule {}
