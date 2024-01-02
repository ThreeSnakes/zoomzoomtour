import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

import { RegularHoliday } from '../domain/regularHoliday.domain';
import { Holiday } from '../domain/holiday.domain';
import { Tour } from '../domain/tour.domain';
import { DAY_OF_WEEK } from '../domain/regularHoliday.domain';
import { TourInfo } from '../domain/tourInfo.domain';

import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';
import { DayjsHelperService } from '../../helper/dayjsHelper/dayjsHelper.service';

import { ModifyTourHolidaysRequestDto } from '../dto/service/modifyTourHolidaysRequest.dto';
import { ModifyTourHolidaysResponseDto } from '../dto/service/modifyTourHolidaysResponse.dto';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { RegularHolidayEntity } from '../../../infra/database/entity/regularHoliday.entity';
import { HolidayEntity } from '../../../infra/database/entity/holiday.entity';
import { Reservation } from '../../reservation/domain/reservation.domain';

@Injectable()
export class ModifyTourHolidaysService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
    private readonly dayjsHelperService: DayjsHelperService,
  ) {}

  private async saveRegularHolidays(
    queryRunner: QueryRunner,
    tour: Tour,
    orgHolidayEntityList: RegularHolidayEntity[],
    newDayList: DAY_OF_WEEK[],
  ): Promise<RegularHoliday[]> {
    if (orgHolidayEntityList.length) {
      await queryRunner.manager.delete(
        RegularHolidayEntity,
        orgHolidayEntityList,
      );
    }

    if (!newDayList.length) {
      return [];
    }

    const RegularHolidayDomains = newDayList.map((day) => {
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

  private async saveHolidays(
    queryRunner: QueryRunner,
    tour: Tour,
    orgHolidayEntiies: HolidayEntity[],
    newDateList: string[],
  ): Promise<Holiday[]> {
    if (orgHolidayEntiies.length) {
      await queryRunner.manager.delete(HolidayEntity, orgHolidayEntiies);
    }

    if (!newDateList.length) {
      return [];
    }

    const holidayDomains = newDateList.map((date) => {
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

      const [orgRegularHolidays, orgHolidays] = await Promise.all([
        Promise.resolve(tourEntity.regularHoliday),
        Promise.resolve(tourEntity.holiday),
      ]);

      const tour = await Tour.createFromEntity(tourEntity);
      const [regularHolidayDomainList, holidayDomains] = await Promise.all([
        this.saveRegularHolidays(
          queryRunner,
          tour,
          orgRegularHolidays,
          regularHolidays,
        ),
        this.saveHolidays(queryRunner, tour, orgHolidays, holidays),
      ]);
      const reservations = await Promise.all(
        (await tourEntity.reservation)?.map((reservationEntity) =>
          Reservation.createFromEntity(reservationEntity),
        ),
      );

      await queryRunner.commitTransaction();

      const tourInfo = TourInfo.createFromTour({
        tour,
        regularHolidays: regularHolidayDomainList,
        holidays: holidayDomains,
      });

      // // 3개월치 캐시 데이터 생성.
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

      return { tourInfo };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
