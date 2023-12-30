import { RESERVATION_STATE } from '../../domain/reservation.domain';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveReservationResponseDto {
  @ApiProperty({
    description: 'Tour ID, 고객이 예약한 Tour의 ID 값.',
  })
  tourId: number;

  @ApiProperty({
    description: '예약 Token, 예약마다 발행되는 고유 Token 값.',
  })
  token: string;

  @ApiProperty({
    description: '예약 상태, WAIT: 대기중, APPROVE: 승인 완료.',
  })
  state: RESERVATION_STATE;
}
