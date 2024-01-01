import { Injectable } from '@nestjs/common';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from '../domain/tour.domain';
import { FetchTourCalendarDto } from '../dto/service/fetchTourCalendar.dto';
import { ReservationCacheService } from '../../reservationCache/service/reservationCache.service';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
    private readonly reservationCacheService: ReservationCacheService,
  ) {}

  async fetchTourCalendar({ tourId, year, month }: FetchTourCalendarDto) {
    const tourEntity = await this.tourRepository.findOneBy({
      id: tourId,
    });

    if (!tourEntity) {
      throw new Error(`tour(${tourId}) is not exist.`);
    }

    return this.reservationCacheService.fetchReservationCache({
      tour: Tour.createFromEntity(tourEntity),
      year: year,
      month: month,
    });
  }
}
