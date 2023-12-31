import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from '../../infra/database/entity/reservation.entity';
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { ClientEntity } from '../../infra/database/entity/client.entity';
import { RedisWrapperModule } from '../redisWarpper/redisWrapper.module';

@Module({
  controllers: [ReservationController],
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, ClientEntity, TourEntity]),
    RedisWrapperModule,
  ],
  providers: [ReservationService],
})
export class ReservationModule {}
