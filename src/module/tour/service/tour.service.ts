import { Injectable } from '@nestjs/common';
import { FetchTourCalendarDto } from '../dto/service/fetchTourCalendar.dto';
import { ReservationCacheService } from '../../reservationCache/service/reservationCache.service';
import { TourRepository } from '../repository/tour.repository';
import { TourInfo } from '../domain/tourInfo.domain';

@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly reservationCacheService: ReservationCacheService,
  ) {}

  async fetchTourCalendar({ tourId, year, month }: FetchTourCalendarDto) {
    const tourInfo = await this.tourRepository.getTourInfoById(tourId);

    return this.reservationCacheService.fetchReservationCache({
      tourInfo,
      year: year,
      month: month,
    });
  }
}
