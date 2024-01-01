import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { CreateNewReservationRequestDto } from '../dto/service/createNewReservationRequest.dto';
import { ReservationCacheService } from '../../reservationCache/reservationCache.service';
import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { Tour } from '../../tour/domain/tour.domain';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation, RESERVATION_STATE } from '../domain/reservation.domain';
import { CreateNewReservationResponseDto } from '../dto/service/createNewReservationResponse.dto';

@Injectable()
export class CreateNewReservationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisWarpperService: ReservationCacheService,
  ) {}
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
        this.dataSource.manager.findOneBy(ClientEntity, {
          id: clientId,
        }),
        this.dataSource.manager.findOneBy(TourEntity, {
          id: tourId,
        }),
      ]);

      if (!tourEntity) {
        throw new Error(`tour(${tourId}) is not exist`);
      }

      if (!clientEntity) {
        throw new Error(`client(${clientId}) is not exist`);
      }

      const tourDate = dayjs(date).format('YYYY-MM-DD');

      const tour = Tour.createFromEntity(tourEntity);
      const isValidTourDate = await tour.isValidTourDate(tourDate);

      if (!isValidTourDate) {
        throw new Error('해당 날짜에는 예약을 할 수 없습니다.');
      }

      const targetDateReservationCnt = await this.dataSource.manager.countBy(
        ReservationEntity,
        {
          date: tourDate,
          state: RESERVATION_STATE.APPROVE,
          tour: {
            id: tourEntity.id,
          },
        },
      );

      const newReservation = new Reservation({
        client: Promise.resolve(clientEntity),
        tour: Promise.resolve(tourEntity),
        date: date,
        state:
          targetDateReservationCnt >= 5
            ? RESERVATION_STATE.WAIT
            : RESERVATION_STATE.APPROVE,
      });
      const result = await queryRunner.manager.save(newReservation.toEntity());
      await queryRunner.commitTransaction();

      const reservation = Reservation.createFromEntity(result);
      await this.redisWarpperService.makeTourReservationCache({
        tour,
        year: reservation.date.year(),
        month: reservation.date.month(),
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
