import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation } from '../domain/reservation.domain';
import { CancelReservationRequestDto } from '../dto/service/cancelReservationRequest.dto';
import { CancelReservationResponseDto } from '../dto/service/cancelReservationResponse.dto';
import { ReservationCacheService } from '../../reservationCache/reservationCache.service';

@Injectable()
export class CancelReservationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisWarpperService: ReservationCacheService,
  ) {}

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
