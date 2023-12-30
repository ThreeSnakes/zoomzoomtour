import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MakeNewReservationDto {
  @ApiProperty({
    description: 'Client ID, CLIENT의 ID 값',
    minimum: 0,
  })
  @IsNumber()
  clientId: number;

  @ApiProperty({
    description: 'Tour ID, Tour의 ID 값',
    minimum: 0,
  })
  @IsNumber()
  tourId: number;
}
