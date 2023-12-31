import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewTourRequestDto } from './dto/service/createNewTourRequest.dto';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { Tour } from './domain/tour.domain';
import { RegularHoliday } from './domain/regularHoliday.domain';
import { Holiday } from './domain/holiday.domain';
import { CreateNewTourResponseDto } from './dto/service/createNewTourResponse.dto';
import { FetchTourCalendarDto } from './dto/service/fetchTourCalendar.dto';
import { RedisWarpperService } from '../redisWarpper/redisWarpper.service';

@Injectable()
export class TourService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly redisWrapperService: RedisWarpperService,
  ) {
    this.tourRepository = tourRepository;
  }

  async createNewTour(
    createNewTourRequestDto: CreateNewTourRequestDto,
  ): Promise<CreateNewTourResponseDto> {
    const seller = await this.sellerRepository.findOneBy({
      id: createNewTourRequestDto.sellerId,
    });

    if (!seller) {
      throw new Error(
        `seller(${createNewTourRequestDto.sellerId}) is not exist.`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTour = new Tour({
        name: createNewTourRequestDto.tourName,
        description: createNewTourRequestDto.tourDescription,
        seller: Promise.resolve(seller),
      });
      const tourResult = await queryRunner.manager.save(newTour.toEntity());

      const regularHolidayEntities =
        createNewTourRequestDto.tourRegularHoliday?.map((regularHoliday) => {
          const newRegularHoliday = new RegularHoliday({
            tour: Promise.resolve(tourResult),
            day: regularHoliday,
          });
          return newRegularHoliday.toEntity();
        }) || [];
      await queryRunner.manager.save(regularHolidayEntities);
      tourResult.regularHoliday = Promise.resolve(regularHolidayEntities);

      const holidayEntities =
        createNewTourRequestDto.tourHoliday?.map((holiday) => {
          const newHoliday = new Holiday({
            tour: Promise.resolve(tourResult),
            date: holiday,
          });
          return newHoliday.toEntity();
        }) || [];
      await queryRunner.manager.save(holidayEntities);
      tourResult.holiday = Promise.resolve(holidayEntities);

      await queryRunner.commitTransaction();

      return {
        tour: Tour.createFromEntity(tourResult),
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchTourCalendar(fetchTourCalendarDto: FetchTourCalendarDto) {
    const yearMonth = dayjs()
      .year(fetchTourCalendarDto.year)
      .month(fetchTourCalendarDto.month - 1)
      .format('YYYY-MM');

    const cache = await this.redisWrapperService.fetchReservationCache({
      tourId: fetchTourCalendarDto.tourId,
      yearMonth,
    });

    return JSON.parse(cache || '{}');
  }
}
