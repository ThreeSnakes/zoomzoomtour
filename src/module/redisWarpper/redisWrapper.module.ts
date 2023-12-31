import { Module } from '@nestjs/common';
import { RedisModule } from '../../infra/redis/redis.module';
import { RedisWarpperService } from './redisWarpper.service';
import { RedisService } from '../../infra/redis/redis.service';

@Module({
  imports: [RedisModule],
  providers: [RedisService, RedisWarpperService],
  exports: [RedisWarpperService],
})
export class RedisWrapperModule {}
