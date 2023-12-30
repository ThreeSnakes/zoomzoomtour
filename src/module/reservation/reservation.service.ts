import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Reservation,
  RESERVATION_STATE,
} from '../../infra/database/entity/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewReservationDto } from './dto/service/createNewReservation.dto';
import { Client } from '../../infra/database/entity/client.entity';
import { Tour } from '../../infra/database/entity/tour.entity';
import { ApproveWaitReservationDto } from './dto/service/approveWaitReservation.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ReservationService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {
    this.reservationRepository = reservationRepository;
    this.clientRepository = clientRepository;
    this.tourRepository = tourRepository;
  }

  async createNewReservation(
    createNewReservationDto: CreateNewReservationDto,
  ): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [client, tour] = await Promise.all([
        this.dataSource.manager.findOneBy(Client, {
          id: createNewReservationDto.clientId,
        }),
        this.dataSource.manager.findOneBy(Tour, {
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

      const newReservation = new Reservation();
      newReservation.client = Promise.resolve(client);
      newReservation.tour = Promise.resolve(tour);
      newReservation.date = dayjs(createNewReservationDto.date).format(
        'YYYY-MM-DD',
      );
      const targetDateReservationCnt = await this.dataSource.manager.countBy(
        Reservation,
        {
          date: dayjs(createNewReservationDto.date).format('YYYY-MM-DD'),
          tour: {
            id: tour.id,
          },
        },
      );
      console.log(`targetDateReservationCnt => `, targetDateReservationCnt);
      newReservation.state =
        targetDateReservationCnt > 5
          ? RESERVATION_STATE.WAIT
          : RESERVATION_STATE.APPROVE;
      await queryRunner.manager.save(newReservation);
      await queryRunner.commitTransaction();
      return newReservation;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async approveWaitReservation(
    approveWaitReservationDto: ApproveWaitReservationDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservation = await this.dataSource.manager.findOneBy(Reservation, {
        token: approveWaitReservationDto.token,
      });

      if (!reservation) {
        throw new Error(
          `reservation(${approveWaitReservationDto.token} is not exist.`,
        );
      }

      const tour = await Promise.resolve(reservation.tour);
      const seller = await Promise.resolve(tour.seller);

      if (seller.id !== approveWaitReservationDto.sellerId) {
        throw new Error(`invalid request`);
      }

      reservation.state = RESERVATION_STATE.APPROVE;

      await queryRunner.manager.save(reservation);
      await queryRunner.commitTransaction();

      return reservation;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
