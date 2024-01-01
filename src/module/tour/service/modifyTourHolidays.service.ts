import { Injectable } from '@nestjs/common';
import { ModifyTourHolidaysRequestDto } from '../dto/service/modifyTourHolidaysRequest.dto';
import { ModifyTourHolidaysResponseDto } from '../dto/service/modifyTourHolidaysResponse.dto';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { RegularHoliday } from '../domain/regularHoliday.domain';
import { RegularHolidayEntity } from '../../../infra/database/entity/regularHoliday.entity';
import { Holiday } from '../domain/holiday.domain';
import { HolidayEntity } from '../../../infra/database/entity/holiday.entity';
import { Tour } from '../domain/tour.domain';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';
import { DayjsHelperService } from '../../helper/dayjsHelper/dayjsHelper.service';

@Injectable()
export class ModifyTourHolidaysService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
    private readonly dayjsHelperService: DayjsHelperService,
  ) {}
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
        await this.makeTourReservationCacheService.execute({
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
