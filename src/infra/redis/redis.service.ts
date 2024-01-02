import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly _redisClient: Redis,
  ) {}

  async refreshCache(key: string, value: object) {
    return this._redisClient.multi().del(key).hset(key, value).exec();
  }

  async hgetall(key: string) {
    return this._redisClient.hgetall(key);
  }

  async exist(key: string) {
    return this._redisClient.exists(key);
  }
}
