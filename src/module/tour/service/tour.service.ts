import { Injectable } from '@nestjs/common';
import { FetchTourCalendarDto } from '../dto/service/fetchTourCalendar.dto';
import { ReservationCacheService } from '../../reservationCache/service/reservationCache.service';
import { TourRepository } from '../repository/tour.repository';

@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly reservationCacheService: ReservationCacheService,
  ) {}

  async fetchTourCalendar({ tourId, year, month }: FetchTourCalendarDto) {
    const tour = await this.tourRepository.getTourById(tourId);

    return this.reservationCacheService.fetchReservationCache({
      tour,
      year: year,
      month: month,
    });
  }
}
