import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './service/tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { ReservationCacheModule } from '../reservationCache/reservationCache.module';
import { DayjsHelperModule } from '../helper/dayjsHelper/dayjsHelper.module';
import { CreateNewTourService } from './service/createNewTour.service';
import { ModifyTourHolidaysService } from './service/modifyTourHolidays.service';
import { TourRepository } from './repository/tour.repository';
import { SellerRepository } from './repository/seller.repository';

@Module({
  controllers: [TourController],
  imports: [
    TypeOrmModule.forFeature([TourEntity, SellerEntity]),
    ReservationCacheModule,
    DayjsHelperModule,
  ],
  providers: [
    TourService,
    CreateNewTourService,
    ModifyTourHolidaysService,
    TourRepository,
    SellerRepository,
  ],
})
export class TourModule {}
