import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from '../../infra/database/entity/tour.entity';
import { Seller } from '../../infra/database/entity/seller.entity';

@Module({
  controllers: [TourController],
  imports: [TypeOrmModule.forFeature([Tour, Seller])],
  providers: [TourService],
})
export class TourModule {}
