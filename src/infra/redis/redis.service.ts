import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly _redisClient: Redis,
  ) {}

  async hmset(key: string, value: Object) {
    return this.redisClient.hmset(key, value);
  }

  async set(key: string, value: string): Promise<string> {
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async hgetall(key: string) {
    return this.redisClient.hgetall(key);
  }

  async hincrby(key: string, field: string, increment: number) {
    return this.redisClient.hincrby(key, field, increment);
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
