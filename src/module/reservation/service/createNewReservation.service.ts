import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DataSource, Equal } from 'typeorm';
import { CreateNewReservationRequestDto } from '../dto/service/createNewReservationRequest.dto';
import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { Tour } from '../../tour/domain/tour.domain';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation, RESERVATION_STATE } from '../domain/reservation.domain';
import { CreateNewReservationResponseDto } from '../dto/service/createNewReservationResponse.dto';
import { TourInfo } from '../../tour/domain/tourInfo.domain';
import { RegularHoliday } from '../../tour/domain/regularHoliday.domain';
import { Holiday } from '../../tour/domain/holiday.domain';
import { Client } from '../../client/domain/client.domain';
import { MakeTourReservationCacheService } from '../../reservationCache/service/makeTourReservationCache.service';

@Injectable()
export class CreateNewReservationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly makeTourReservationCacheService: MakeTourReservationCacheService,
  ) {}

  async getTourInfo(tourEntity: TourEntity) {
    const [regularHolidayEntities, holidayEntities] = await Promise.all([
      Promise.resolve(tourEntity.regularHoliday),
      Promise.resolve(tourEntity.holiday),
    ]);
    const tour = await Tour.createFromEntity(tourEntity);
    const regularHolidays = await Promise.all(
      regularHolidayEntities.map((regularHolidayEntity) =>
        RegularHoliday.createFromEntity(regularHolidayEntity),
      ),
    );
    const holidays = await Promise.all(
      holidayEntities.map((holidayEntity) =>
        Holiday.createFromEntity(holidayEntity),
      ),
    );

    return TourInfo.createFromTour({
      tour,
      regularHolidays,
      holidays,
    });
  }

  async execute({
    clientId,
    tourId,
    date,
  }: CreateNewReservationRequestDto): Promise<CreateNewReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [clientEntity, tourEntity] = await Promise.all([
        this.dataSource.manager.findOneByOrFail(ClientEntity, {
          id: clientId,
        }),
        this.dataSource.manager.findOneByOrFail(TourEntity, {
          id: tourId,
        }),
      ]);
      const tourDate = dayjs(date).format('YYYY-MM-DD');
      const tourInfo = await this.getTourInfo(tourEntity);
      const isValidTourDate = tourInfo.isTourHoliday(tourDate);

      if (isValidTourDate) {
        throw new Error('해당 날짜에는 예약을 할 수 없습니다.');
      }

      const targetDateReservationCnt = await this.dataSource.manager.countBy(
        ReservationEntity,
        {
          date: Equal(dayjs(date).toDate()),
          state: RESERVATION_STATE.APPROVE,
          tour: {
            id: tourEntity.id,
          },
        },
      );

      const newReservation = new Reservation({
        client: Client.createFromEntity(clientEntity),
        tour: tourInfo,
        date: dayjs(date),
        state:
          targetDateReservationCnt >= 5
            ? RESERVATION_STATE.WAIT
            : RESERVATION_STATE.APPROVE,
      });
      const result = await queryRunner.manager.save(newReservation.toEntity());
      await queryRunner.commitTransaction();

      const reservation = await Reservation.createFromEntity(result);
      await this.makeTourReservationCacheService.execute({
        tourInfo,
        year: dayjs(date).year(),
        month: dayjs(date).month(),
      });

      return {
        reservation,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
