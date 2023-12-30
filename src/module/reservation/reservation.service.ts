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
      const orgReservations = await Promise.resolve(tour.reservation);
      newReservation.state =
        orgReservations.length > 5
          ? RESERVATION_STATE.WAIT
          : RESERVATION_STATE.APPROVE;
      await queryRunner.manager.save(newReservation);
      await queryRunner.commitTransaction();
      return newReservation;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }
}
