import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly _redisClient: Redis,
  ) {}

  async set(key: string, value: string): Promise<string> {
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async hset(key: string, field: string, value: string) {
    return this.redisClient.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string> {
    console.log(key, field);
    return this.redisClient.hget(key, field);
  }

  get redisClient() {
    return this._redisClient;
  }
}