import { Injectable } from '@nestjs/common';
import { MakeTourReservationCacheDto } from '../dto/service/makeTourReservationCache.dto';
import * as dayjs from 'dayjs';
import { RedisService } from '../../../infra/redis/redis.service';

@Injectable()
export class MakeTourReservationCacheService {
  constructor(private readonly redisService: RedisService) {}
  async execute({
    tourInfo,
    year,
    month,
  }: MakeTourReservationCacheDto): Promise<void> {
    const targetDate = dayjs().year(year).month(month);
    const lastDay = targetDate.endOf('month').get('date');

    const key = `${tourInfo.id}|${targetDate.format('YYYY-MM')}`;

    const result = {};
    for (let i = 1; i <= lastDay; i += 1) {
      const date = targetDate.date(i).format('YYYY-MM-DD');
      const isTourHoliday = tourInfo.isTourHoliday(date);
      if (!isTourHoliday) {
        result[i] = 5;
      }
    }

    // (await tourInfo.reservations()).map((reservation) => {
    //   if (reservation.state !== RESERVATION_STATE.APPROVE) {
    //     return;
    //   }
    //
    //   const date = reservation.date;
    //   if (year === date.year() && month === date.month()) {
    //     result[date.date()] -= 1;
    //     if (result[date.date()] <= 0) {
    //       delete result[date.date()];
    //     }
    //   }
    // });

    await this.redisService.hset(key, result);

    return;
  }
}
