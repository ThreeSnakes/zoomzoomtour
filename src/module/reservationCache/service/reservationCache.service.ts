import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../infra/redis/redis.service';
import { FetchReservationCacheRequestDto } from '../dto/service/fetchReservationCacheRequest.dto';
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
  }: FetchReservationCacheRequestDto): Promise<Record<string, number>> {
    const yearMonth = dayjs().year(year).month(month).format('YYYY-MM');
    const key = `reservation|${tourInfo.id}|${yearMonth}`;

    // 캐시가 존재하지 않는 경우 캐시 생성.
    const tourMonthCache = await this.redisService.exist(key);
    if (!tourMonthCache) {
      await this.makeTourReservationCacheService.execute({
        tourInfo,
        year,
        month,
      });
    }

    const cache = await this.redisService.hgetall(key);

    return Object.keys(cache).reduce((map, date) => {
      map[date] = +cache[date];
      return map;
    }, {});
  }
}
