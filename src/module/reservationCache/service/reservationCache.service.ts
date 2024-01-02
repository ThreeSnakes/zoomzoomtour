import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../infra/redis/redis.service';
import { FetchReservationCacheDto } from '../dto/service/fetchReservationCache.dto';
import { MakeTourReservationCacheService } from './makeTourReservationCache.service';

@Injectable()
export class ReservationCacheService {
  constructor(
    private readonly redisService: RedisService,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
  ) {}

  async fetchReservationCache({
    tourInfo,
    year,
    month,
  }: FetchReservationCacheDto) {
    const yearMonth = dayjs().year(year).month(month).format('YYYY-MM');
    const key = `${tourInfo.id}|${yearMonth}`;

    // 캐시가 존재하지 않는 경우 캐시 생성.
    const tourMonthCache = await this.redisService.exist(key);
    if (!tourMonthCache) {
      await this.makeTourReservationCacheService.execute({
        tourInfo,
        year,
        month,
      });
    }

    return this.redisService.hgetall(key);
  }
}
