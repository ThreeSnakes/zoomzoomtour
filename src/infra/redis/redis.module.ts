import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

const redisClient = new Redis({
  db: 7,
  host: 'localhost',
  port: 6379,
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
