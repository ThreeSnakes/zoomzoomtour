import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation } from '../domain/reservation.domain';
import { CancelReservationRequestDto } from '../dto/service/cancelReservationRequest.dto';
import { CancelReservationResponseDto } from '../dto/service/cancelReservationResponse.dto';
import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';
import { TourInfo } from '../../tour/domain/tourInfo.domain';
import { Holiday } from '../../tour/domain/holiday.domain';
import { RegularHoliday } from '../../tour/domain/regularHoliday.domain';

@Injectable()
export class CancelReservationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
  ) {}

  async execute({
    clientId,
    token,
  }: CancelReservationRequestDto): Promise<CancelReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservationEntity = await this.dataSource.manager.findOneBy(
        ReservationEntity,
        {
          token,
          client: {
            id: clientId,
          },
        },
      );

      if (!reservationEntity) {
        throw new Error(`reservation${token} is not exist.`);
      }

      const reservation = await Reservation.createFromEntity(reservationEntity);
      reservation.cancel();

      const result = await queryRunner.manager.save(reservation.toEntity());
      const tour = await result.tour;
      const holidayEntities = await tour.holiday;
      const regularHolidayEntities = await tour.regularHoliday;
      await queryRunner.commitTransaction();

      const tourInfo = TourInfo.createFromTour({
        tour: reservation.tour,
        holidays: await Promise.all(
          holidayEntities.map((holidayEntity) =>
            Holiday.createFromEntity(holidayEntity),
          ),
        ),
        regularHolidays: await Promise.all(
          regularHolidayEntities.map((regularHolidayEntity) =>
            RegularHoliday.createFromEntity(regularHolidayEntity),
          ),
        ),
      });

      await this.makeTourReservationCacheService.execute({
        tourInfo,
        year: reservation.date.year(),
        month: reservation.date.month(),
      });

      return {
        reservation: await Reservation.createFromEntity(result),
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
