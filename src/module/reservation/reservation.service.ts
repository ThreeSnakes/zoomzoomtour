import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ReservationEntity } from '../../infra/database/entity/reservation.entity';
import { CreateNewReservationRequestDto } from './dto/service/createNewReservationRequest.dto';
import { ClientEntity } from '../../infra/database/entity/client.entity';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { ApproveWaitReservationRequestDto } from './dto/service/approveWaitReservationRequest.dto';
import { Reservation, RESERVATION_STATE } from './domain/reservation.domain';
import { CreateNewReservationResponseDto } from './dto/service/createNewReservationResponse.dto';
import { ApproveWaitReservationResponseDto } from './dto/service/approveWaitReservationResponse.dto';
import { CancelReservationRequestDto } from './dto/service/cancelReservationRequest.dto';
import { CancelReservationResponseDto } from './dto/service/cancelReservationResponse.dto';
import { ReservationCacheService } from '../reservationCache/reservationCache.service';
import { Tour } from '../tour/domain/tour.domain';

@Injectable()
export class ReservationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisWarpperService: ReservationCacheService,
  ) {}

  private makeDaysObject(yearMonth) {
    const lastDay = dayjs(yearMonth, 'YYYY-MM').endOf('month').date();
    const result = {};

    for (let i = 1; i <= lastDay; i += 1) {
      result[i] = [];
    }

    return result;
  }

  async createNewReservation({
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

  async approveWaitReservation({
    sellerId,
    token,
  }: ApproveWaitReservationRequestDto): Promise<ApproveWaitReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservationEntity = await this.dataSource.manager.findOneBy(
        ReservationEntity,
        {
          token,
          tour: {
            seller: {
              id: sellerId,
            },
          },
        },
      );

      if (!reservationEntity) {
        throw new Error(`reservation(${token} is not exist.`);
      }
      const reservation = Reservation.createFromEntity(reservationEntity);

      reservation.approve();

      const result = await queryRunner.manager.save(reservation.toEntity());
      await queryRunner.commitTransaction();

      return {
        reservation: Reservation.createFromEntity(result),
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelReservation({
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

      const reservation = Reservation.createFromEntity(reservationEntity);
      reservation.cancel();

      const result = await queryRunner.manager.save(reservation.toEntity());
      await queryRunner.commitTransaction();

      return {
        reservation: Reservation.createFromEntity(result),
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
