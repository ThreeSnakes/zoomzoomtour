import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infra/redis/redis.service';
import { FetchReservationCacheDto } from './dto/service/fetchReservationCache.dto';
import { SaveReservationCacheDto } from './dto/service/saveReservationCache.dto';
import { MakeTourReservationCacheDto } from './dto/service/makeTourReservationCache.dto';

@Injectable()
export class ReservationCacheService {
  constructor(private readonly redisService: RedisService) {}

  async saveReservationCache(
    saveReservationCacheDto: SaveReservationCacheDto,
  ): Promise<void> {
    const targetDate = dayjs(saveReservationCacheDto.reservationDate);
    const yearMonth = targetDate.format('YYYY-MM');
    const date = targetDate.get('date');

    const key = `${saveReservationCacheDto.tourId}|${yearMonth}`;
    const field = `${date}`;

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
    return this.redisService.hgetall(
      `${fetchReservationCacheDto.tourId}|${fetchReservationCacheDto.yearMonth}`,
    );
  }
}
