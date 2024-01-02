import { Injectable } from '@nestjs/common';
import { FetchTourCalendarRequestDto } from '../dto/service/fetchTourCalendarRequest.dto';
import { ReservationCacheService } from '../../reservationCache/service/reservationCache.service';
import { TourRepository } from '../repository/tour.repository';
import { FetchTourCalendarResponseDto } from '../dto/service/fetchTourCalendarResponse.dto';

@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly reservationCacheService: ReservationCacheService,
  ) {}

  async fetchTourCalendar({
    tourId,
    year,
    month,
  }: FetchTourCalendarRequestDto): Promise<FetchTourCalendarResponseDto> {
    const tourInfo = await this.tourRepository.getTourInfoById(tourId);
    const tourCalendar =
      await this.reservationCacheService.fetchReservationCache({
        tourInfo,
        year: year,
        month: month,
      });

    return {
      tourInfo,
      tourCalendar,
    };
  }
}
