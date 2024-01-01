import { Module } from '@nestjs/common';
import { RedisModule } from '../../infra/redis/redis.module';
import { RedisService } from '../../infra/redis/redis.service';
import { MakeTourReservationCacheService } from './service/makeTourReservationCache.service';
import { ReservationCacheService } from './service/reservationCache.service';

@Module({
  imports: [RedisModule],
  providers: [
    RedisService,
    ReservationCacheService,
    MakeTourReservationCacheService,
  ],
  exports: [ReservationCacheService, MakeTourReservationCacheService],
})
export class ReservationCacheModule {}
