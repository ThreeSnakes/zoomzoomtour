import { Injectable } from '@nestjs/common';
import { ApproveWaitReservationRequestDto } from '../dto/service/approveWaitReservationRequest.dto';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Reservation } from '../domain/reservation.domain';
import { DataSource } from 'typeorm';
import { ApproveWaitReservationResponseDto } from '../dto/service/approveWaitReservationResponse.dto';

@Injectable()
export class ApproveWaitReservationService {
  constructor(private readonly dataSource: DataSource) {}
  async execute({
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
}
