import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infra/redis/redis.service';
import { FetchReservationCacheDto } from './dto/service/fetchReservationCache.dto';
import { SaveReservationCacheDto } from './dto/service/saveReservationCache.dto';

@Injectable()
export class RedisWarpperService {
  constructor(private readonly redisService: RedisService) {}

  async saveReservationCache(
    saveReservationCacheDto: SaveReservationCacheDto,
  ): Promise<void> {
    const targetDate = dayjs(saveReservationCacheDto.reservationDate);
    const yearMonth = targetDate.format('YYYY-MM');
    const date = targetDate.get('date');

    const reservationCache = await this.redisService.hget(
      `${saveReservationCacheDto.tourId}`,
      yearMonth,
    );
    const parsedCache = JSON.parse(reservationCache || '{}');
    parsedCache[date] ??= [];
    parsedCache[date].push(saveReservationCacheDto.token);
    await this.redisService.hset(
      `${saveReservationCacheDto.tourId}`,
      yearMonth,
      JSON.stringify(parsedCache),
    );
    return;
  }

  async fetchReservationCache(
    fetchReservationCacheDto: FetchReservationCacheDto,
  ) {
    return this.redisService.hget(
      `${fetchReservationCacheDto.tourId}`,
      fetchReservationCacheDto.yearMonth,
    );
  }
}
