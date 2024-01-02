import { Module } from '@nestjs/common';
import { RedisModule } from '../../infra/redis/redis.module';
import { RedisService } from '../../infra/redis/redis.service';
import { MakeTourReservationCacheService } from './service/makeTourReservationCache.service';
import { ReservationCacheService } from './service/reservationCache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from '../../infra/database/entity/reservation.entity';
import { ReservationRepository } from './repository/reservation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity]), RedisModule],
  providers: [
    RedisService,
    ReservationCacheService,
    MakeTourReservationCacheService,
    ReservationRepository,
  ],
  exports: [ReservationCacheService, MakeTourReservationCacheService],
})
export class ReservationCacheModule {}
