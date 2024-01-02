import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { Tour } from '../domain/tour.domain';
import { TourInfo } from '../domain/tourInfo.domain';
import { RegularHoliday } from '../domain/regularHoliday.domain';
import { Holiday } from '../domain/holiday.domain';

export class TourRepository {
  constructor(
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
  ) {}

  async getTourById(tourId: number): Promise<Tour> {
    const result = await this.tourRepository.findOneOrFail({
      where: {
        id: tourId,
      },
    });

    return Tour.createFromEntity(result);
  }

  async getTourInfoById(tourId: number): Promise<TourInfo> {
    const tourEntity = await this.tourRepository.findOneOrFail({
      where: {
        id: tourId,
      },
    });

    const tour = await Tour.createFromEntity(tourEntity);
    const regularHolidays = await Promise.all(
      (await tourEntity.regularHoliday)?.map((regularHoliday) =>
        RegularHoliday.createFromEntity(regularHoliday),
      ),
    );
    const holidays = await Promise.all(
      (await tourEntity.holiday)?.map((holiday) =>
        Holiday.createFromEntity(holiday),
      ),
    );

    return TourInfo.createFromTour({
      tour,
      holidays,
      regularHolidays,
    });
  }
}
