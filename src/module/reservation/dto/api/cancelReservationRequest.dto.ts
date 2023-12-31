import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CancelReservationRequestDto {
  @ApiProperty({
    description: 'clientID, CLIENT의 ID 값',
    minimum: 1,
  })
  @IsNumber()
  clientId: number;
}
