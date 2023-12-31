import { Module } from '@nestjs/common';
import { RedisModule } from '../../infra/redis/redis.module';
import { ReservationCacheService } from './reservationCache.service';
import { RedisService } from '../../infra/redis/redis.service';

@Module({
  imports: [RedisModule],
  providers: [RedisService, ReservationCacheService],
  exports: [ReservationCacheService],
})
export class ReservationCacheModule {}
