import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReservationEntity } from '../../infra/database/entity/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewReservationRequestDto } from './dto/service/createNewReservationRequest.dto';
import { ClientEntity } from '../../infra/database/entity/client.entity';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { ApproveWaitReservationRequestDto } from './dto/service/approveWaitReservationRequest.dto';
import { Reservation, RESERVATION_STATE } from './domain/reservation.domain';
import { CreateNewReservationResponseDto } from './dto/service/createNewReservationResponse.dto';
import { ApproveWaitReservationResponseDto } from './dto/service/approveWaitReservationResponse.dto';
import { CancelReservationRequestDto } from './dto/service/cancelReservationRequest.dto';
import { CancelReservationResponseDto } from './dto/service/cancelReservationResponse.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
  ) {
    this.reservationRepository = reservationRepository;
    this.clientRepository = clientRepository;
    this.tourRepository = tourRepository;
  }

  async createNewReservation(
    createNewReservationDto: CreateNewReservationRequestDto,
  ): Promise<CreateNewReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [client, tour] = await Promise.all([
        this.dataSource.manager.findOneBy(ClientEntity, {
          id: createNewReservationDto.clientId,
        }),
        this.dataSource.manager.findOneBy(TourEntity, {
          id: createNewReservationDto.tourId,
        }),
      ]);

      if (!tour) {
        throw new Error(`tour(${createNewReservationDto.tourId}) is not exist`);
      }

      if (!client) {
        throw new Error(
          `client(${createNewReservationDto.clientId}) is not exist`,
        );
      }

      const targetDateReservationCnt = await this.dataSource.manager.countBy(
        ReservationEntity,
        {
          date: dayjs(createNewReservationDto.date).format('YYYY-MM-DD'),
          tour: {
            id: tour.id,
          },
        },
      );

      const newReservation = new Reservation({
        client: Promise.resolve(client),
        tour: Promise.resolve(tour),
        date: createNewReservationDto.date,
        state:
          targetDateReservationCnt > 5
            ? RESERVATION_STATE.WAIT
            : RESERVATION_STATE.APPROVE,
      });
      const result = await queryRunner.manager.save(newReservation.toEntity());
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

  async approveWaitReservation(
    approveWaitReservationDto: ApproveWaitReservationRequestDto,
  ): Promise<ApproveWaitReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservationEntity = await this.dataSource.manager.findOneBy(
        ReservationEntity,
        {
          token: approveWaitReservationDto.token,
          tour: {
            seller: {
              id: approveWaitReservationDto.sellerId,
            },
          },
        },
      );

      if (!reservationEntity) {
        throw new Error(
          `reservation(${approveWaitReservationDto.token} is not exist.`,
        );
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

  async cancelReservation(
    cancelReservationRequestDto: CancelReservationRequestDto,
  ): Promise<CancelReservationResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservationEntity = await this.dataSource.manager.findOneBy(
        ReservationEntity,
        {
          token: cancelReservationRequestDto.token,
          client: {
            id: cancelReservationRequestDto.clientId,
          },
        },
      );

      if (!reservationEntity) {
        throw new Error(
          `reservation${cancelReservationRequestDto.token} is not exist.`,
        );
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
