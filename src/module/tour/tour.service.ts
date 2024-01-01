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
import { ReservationCacheService } from '../reservationCache/reservationCache.service';
import { DayjsHelperService } from '../helper/dayjsHelper/dayjsHelper.service';
import { ModifyTourHolidaysRequestDto } from './dto/service/modifyTourHolidaysRequest.dto';
import { ModifyTourHolidaysResponseDto } from './dto/service/modifyTourHolidaysResponse.dto';
import { RegularHolidayEntity } from '../../infra/database/entity/regularHoliday.entity';
import { HolidayEntity } from '../../infra/database/entity/holiday.entity';

@Injectable()
export class TourService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
    private readonly reservationCacheService: ReservationCacheService,
    private readonly dayjsHelperService: DayjsHelperService,
  ) {}

  async createNewTour({
    sellerId,
    tourName,
    tourDescription,
    tourRegularHoliday,
    tourHoliday,
  }: CreateNewTourRequestDto): Promise<CreateNewTourResponseDto> {
    const seller = await this.sellerRepository.findOneBy({
      id: sellerId,
    });

    if (!seller) {
      throw new Error(`seller(${sellerId}) is not exist.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTour = new Tour({
        name: tourName,
        description: tourDescription,
        seller: Promise.resolve(seller),
      });
      const tourResult = await queryRunner.manager.save(newTour.toEntity());

      const regularHolidayEntities =
        tourRegularHoliday?.map((regularHoliday) => {
          const newRegularHoliday = new RegularHoliday({
            tour: Promise.resolve(tourResult),
            day: regularHoliday,
          });
          return newRegularHoliday.toEntity();
        }) || [];
      await queryRunner.manager.save(regularHolidayEntities);
      tourResult.regularHoliday = Promise.resolve(regularHolidayEntities);

      const holidayEntities =
        tourHoliday?.map((holiday) => {
          const newHoliday = new Holiday({
            tour: Promise.resolve(tourResult),
            date: holiday,
          });
          return newHoliday.toEntity();
        }) || [];
      await queryRunner.manager.save(holidayEntities);
      tourResult.holiday = Promise.resolve(holidayEntities);

      const tour = Tour.createFromEntity(tourResult);
      await queryRunner.commitTransaction();

      // 해당월부터 3개월치의 예약 가능한 날짜 캐시를 만들어 놓는다.
      const dateRange = this.dayjsHelperService.makeDateRange(
        dayjs(),
        dayjs().add(3, 'month'),
        'month',
      );
      for (const day of dateRange) {
        await this.reservationCacheService.makeTourReservationCache({
          tour,
          year: day.year(),
          month: day.month(),
        });
      }

      return {
        tour,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

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

  async modifyTourHolidays({
    tourId,
    regularHolidays,
    holidays,
  }: ModifyTourHolidaysRequestDto): Promise<ModifyTourHolidaysResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tourEntity = await this.dataSource.manager.findOneBy(TourEntity, {
        id: tourId,
      });

      if (!tourEntity) {
        throw new Error(`tour(${tourId}) is not exist.`);
      }

      const [orgRgularHolidays, orgHolidays] = await Promise.all([
        Promise.resolve(tourEntity.regularHoliday),
        Promise.resolve(tourEntity.holiday),
      ]);

      const regularHolidayEntities =
        regularHolidays?.map((regularHoliday) => {
          const newRegularHoliday = new RegularHoliday({
            tour: Promise.resolve(tourEntity),
            day: regularHoliday,
          });
          return newRegularHoliday.toEntity();
        }) || [];
      orgRgularHolidays?.length &&
        (await queryRunner.manager.delete(
          RegularHolidayEntity,
          await Promise.resolve(tourEntity.regularHoliday),
        ));
      await queryRunner.manager.save(regularHolidayEntities);
      tourEntity.regularHoliday = Promise.resolve(regularHolidayEntities);

      const holidayEntities =
        holidays?.map((holiday) => {
          const newHoliday = new Holiday({
            tour: Promise.resolve(tourEntity),
            date: holiday,
          });
          return newHoliday.toEntity();
        }) || [];
      orgHolidays?.length &&
        (await queryRunner.manager.delete(
          HolidayEntity,
          await Promise.resolve(tourEntity.holiday),
        ));
      await queryRunner.manager.save(holidayEntities);
      tourEntity.holiday = Promise.resolve(holidayEntities);

      await queryRunner.commitTransaction();
      const tour = Tour.createFromEntity(tourEntity);

      // 3개월치 캐시 데이터 생성.
      const dateRange = this.dayjsHelperService.makeDateRange(
        dayjs(),
        dayjs().add(3, 'month'),
        'month',
      );
      for (const day of dateRange) {
        await this.reservationCacheService.makeTourReservationCache({
          tour,
          year: day.year(),
          month: day.month(),
        });
      }

      return { tour };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
