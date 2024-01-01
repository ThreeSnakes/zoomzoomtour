import { Injectable } from '@nestjs/common';
import { CreateNewTourRequestDto } from '../dto/service/createNewTourRequest.dto';
import { CreateNewTourResponseDto } from '../dto/service/createNewTourResponse.dto';
import { Tour } from '../domain/tour.domain';
import { RegularHoliday } from '../domain/regularHoliday.domain';
import { Holiday } from '../domain/holiday.domain';
import * as dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';
import { DayjsHelperService } from '../../helper/dayjsHelper/dayjsHelper.service';

@Injectable()
export class CreateNewTourService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
    private readonly dayjsHelperService: DayjsHelperService,
  ) {}
  async execute({
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
        await this.makeTourReservationCacheService.execute({
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
}
