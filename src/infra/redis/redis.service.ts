import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly _redisClient: Redis,
  ) {}

  async hset(key: string, value: object) {
    return this._redisClient.hset(key, value);
  }

  async hgetall(key: string) {
    return this._redisClient.hgetall(key);
  }

  async hincrby(key: string, field: string, increment: number) {
    return this._redisClient.hincrby(key, field, increment);
  }

  async exist(key: string) {
    return this._redisClient.exists(key);
  }
}
