import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infra/redis/redis.service';
import { FetchReservationCacheDto } from './dto/service/fetchReservationCache.dto';
import { SaveReservationCountCacheDto } from './dto/service/saveReservationCountCache.dto';
import { MakeTourReservationCacheDto } from './dto/service/makeTourReservationCache.dto';

@Injectable()
export class ReservationCacheService {
  constructor(private readonly redisService: RedisService) {}

  async saveReservationCountCache(
    saveReservationCountCacheDto: SaveReservationCountCacheDto,
  ): Promise<void> {
    const targetDate = dayjs(saveReservationCountCacheDto.reservationDate);
    const yearMonth = targetDate.format('YYYY-MM');
    const date = targetDate.get('date');

    const key = `${saveReservationCountCacheDto.tour.id}|${yearMonth}`;
    const field = `${date}`;

    // 캐시가 존재하지 않는 경우 캐시 생성.
    const tourMonthCache = await this.redisService.exist(key);
    if (!tourMonthCache) {
      await this.makeTourReservationCache({
        tour: saveReservationCountCacheDto.tour,
        year: targetDate.year(),
        month: targetDate.month() + 1,
      });
    }

    await this.redisService.hincrby(key, field, -1);
    return;
  }

  async makeTourReservationCache(
    makeTourReservationCacheDto: MakeTourReservationCacheDto,
  ): Promise<void> {
    const targetDate = dayjs()
      .year(makeTourReservationCacheDto.year)
      .month(makeTourReservationCacheDto.month - 1);
    const lastDay = targetDate.endOf('month').get('date');

    const key = `${makeTourReservationCacheDto.tour.id}|${targetDate.format(
      'YYYY-MM',
    )}`;

    const result = {};
    for (let i = 1; i <= lastDay; i += 1) {
      const date = targetDate.date(i).format('YYYY-MM-DD');
      const isTourAvailable =
        await makeTourReservationCacheDto.tour.isValidTourDate(date);
      if (isTourAvailable) {
        result[i] = 5;
      }
    }

    await this.redisService.hmset(key, result);

    return;
  }

  async fetchReservationCache(
    fetchReservationCacheDto: FetchReservationCacheDto,
  ) {
    const yearMonth = dayjs()
      .year(fetchReservationCacheDto.year)
      .month(fetchReservationCacheDto.month - 1)
      .format('YYYY-MM');
    const key = `${fetchReservationCacheDto.tour.id}|${yearMonth}`;

    // 캐시가 존재하지 않는 경우 캐시 생성.
    const tourMonthCache = await this.redisService.exist(key);
    if (!tourMonthCache) {
      await this.makeTourReservationCache({
        tour: fetchReservationCacheDto.tour,
        year: fetchReservationCacheDto.year,
        month: fetchReservationCacheDto.month,
      });
    }

    return this.redisService.hgetall(key);
  }
}
