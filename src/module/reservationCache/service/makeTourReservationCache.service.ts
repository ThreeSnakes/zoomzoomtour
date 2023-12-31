import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { MakeTourReservationCacheDto } from '../dto/service/makeTourReservationCache.dto';
import { RedisService } from '../../../infra/redis/redis.service';
import { RESERVATION_STATE } from '../../reservation/domain/reservation.domain';
import { ReservationRepository } from '../repository/reservation.repository';

@Injectable()
export class MakeTourReservationCacheService {
  constructor(
    private readonly redisService: RedisService,
    private readonly reservationRepository: ReservationRepository,
  ) {}
  async execute({
    tourInfo,
    year,
    month,
  }: MakeTourReservationCacheDto): Promise<void> {
    const targetDate = dayjs().year(year).month(month);
    const lastDay = targetDate.endOf('month').get('date');

    const key = `reservation|${tourInfo.id}|${targetDate.format('YYYY-MM')}`;

    const result = {};
    for (let i = 1; i <= lastDay; i += 1) {
      const date = targetDate.date(i).format('YYYY-MM-DD');
      const isTourHoliday = tourInfo.isTourHoliday(date);
      result[i] = isTourHoliday ? 0 : 5;
    }

    const reservations =
      await this.reservationRepository.fetchReservationByTourIdAndYearMonth(
        tourInfo.id,
        year,
        month,
      );

    reservations?.forEach((reservation) => {
      if (reservation.state !== RESERVATION_STATE.APPROVE) {
        return;
      }

      const date = reservation.date;
      if (year === date.year() && month === date.month()) {
        if (result[date.date()] > 0) {
          result[date.date()] -= 1;
        }
      }
    });

    await this.redisService.refreshCache(key, result);

    return;
  }
}
