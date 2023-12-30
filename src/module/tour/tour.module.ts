import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { SellerEntity } from '../../infra/database/entity/seller.entity';

@Module({
  controllers: [TourController],
  imports: [TypeOrmModule.forFeature([TourEntity, SellerEntity])],
  providers: [TourService],
})
export class TourModule {}
