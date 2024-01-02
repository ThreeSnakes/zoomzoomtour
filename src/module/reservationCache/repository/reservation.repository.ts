import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation } from '../../reservation/domain/reservation.domain';

export class ReservationRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async fetchReservationByTourIdAndYearMonth(
    tourId: number,
    year: number,
    month: number,
  ): Promise<Reservation[]> {
    const result = await this.reservationRepository.findBy({
      tour: {
        id: tourId,
      },
      date: Between(
        dayjs().year(year).month(month).startOf('month').toDate(),
        dayjs().year(year).month(month).endOf('month').toDate(),
      ),
    });

    return Promise.all(
      result.map((entity) => Reservation.createFromEntity(entity)),
    );
  }
}
