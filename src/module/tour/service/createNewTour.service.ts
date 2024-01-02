import { Injectable } from '@nestjs/common';
import { CreateNewTourRequestDto } from '../dto/service/createNewTourRequest.dto';
import { CreateNewTourResponseDto } from '../dto/service/createNewTourResponse.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';
import { DayjsHelperService } from '../../helper/dayjsHelper/dayjsHelper.service';
import { SellerRepository } from '../repository/seller.repository';
import { Tour } from '../domain/tour.domain';
import { DAY_OF_WEEK, RegularHoliday } from '../domain/regularHoliday.domain';
import { Holiday } from '../domain/holiday.domain';
import { TourInfo } from '../domain/tourInfo.domain';
import dayjs from 'dayjs';

@Injectable()
export class CreateNewTourService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sellerRepository: SellerRepository,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
    private readonly dayjsHelperService: DayjsHelperService,
  ) {}

  private async saveRegularHolidays(
    queryRunner: QueryRunner,
    tour: Tour,
    dayList: DAY_OF_WEEK[],
  ): Promise<RegularHoliday[]> {
    if (!dayList.length) {
      return [];
    }

    const RegularHolidayDomains = dayList.map((day) => {
      return new RegularHoliday({
        day,
        tour,
      });
    });
    const result = await queryRunner.manager.save(
      RegularHolidayDomains.map((domain) => domain.toEntity()),
    );

    return Promise.all(
      result.map((data) => RegularHoliday.createFromEntity(data)),
    );
  }

  private async saveHoliday(
    queryRunner: QueryRunner,
    tour: Tour,
    dateList: string[],
  ): Promise<Holiday[]> {
    if (!dateList.length) {
      return [];
    }

    const holidayDomains = dateList.map((date) => {
      return new Holiday({
        date: dayjs(date),
        tour,
      });
    });
    const result = await queryRunner.manager.save(
      holidayDomains.map((domain) => domain.toEntity()),
    );

    return Promise.all(result.map((data) => Holiday.createFromEntity(data)));
  }

  async execute({
    sellerId,
    tourName,
    tourDescription,
    tourRegularHoliday,
    tourHoliday,
  }: CreateNewTourRequestDto): Promise<CreateNewTourResponseDto> {
    const seller = await this.sellerRepository.getSellerById(sellerId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTour = new Tour({
        name: tourName,
        description: tourDescription,
        seller,
      });
      const tourResult = await queryRunner.manager.save(newTour.toEntity());
      const tour = await Tour.createFromEntity(tourResult);
      const regularHolidays = await this.saveRegularHolidays(
        queryRunner,
        tour,
        tourRegularHoliday,
      );
      const holidays = await this.saveHoliday(queryRunner, tour, tourHoliday);
      const tourInfo = TourInfo.createFromTour({
        tour,
        holidays,
        regularHolidays,
      });
      await queryRunner.commitTransaction();

      // 해당월부터 3개월치의 예약 가능한 날짜 캐시를 만들어 놓는다.
      const dateRange = this.dayjsHelperService.makeDateRange(
        dayjs(),
        dayjs().add(3, 'month'),
        'month',
      );
      for (const day of dateRange) {
        await this.makeTourReservationCacheService.execute({
          tourInfo,
          year: day.year(),
          month: day.month(),
        });
      }

      return {
        tourInfo,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
