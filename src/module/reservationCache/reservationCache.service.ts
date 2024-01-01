import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infra/redis/redis.service';
import { FetchReservationCacheDto } from './dto/service/fetchReservationCache.dto';
import { MakeTourReservationCacheDto } from './dto/service/makeTourReservationCache.dto';
import { RESERVATION_STATE } from '../reservation/domain/reservation.domain';

@Injectable()
export class ReservationCacheService {
  constructor(private readonly redisService: RedisService) {}

  async makeTourReservationCache(
    makeTourReservationCacheDto: MakeTourReservationCacheDto,
  ): Promise<void> {
    const targetDate = dayjs()
      .year(makeTourReservationCacheDto.year)
      .month(makeTourReservationCacheDto.month);
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

    (await makeTourReservationCacheDto.tour.reservations()).map(
      (reservation) => {
        if (reservation.state !== RESERVATION_STATE.APPROVE) {
          return;
        }

        const date = reservation.date;
        if (
          makeTourReservationCacheDto.year === date.year() &&
          makeTourReservationCacheDto.month === date.month()
        ) {
          result[date.date()] -= 1;
          if (result[date.date()] <= 0) {
            delete result[date.date()];
          }
        }
      },
    );

    await this.redisService.hset(key, result);

    return;
  }

  async fetchReservationCache(
    fetchReservationCacheDto: FetchReservationCacheDto,
  ) {
    const yearMonth = dayjs()
      .year(fetchReservationCacheDto.year)
      .month(fetchReservationCacheDto.month)
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
