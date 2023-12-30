import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MakeNewReservationRequestDto {
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

  @ApiProperty({
    description: '예약 날짜, YYYY-MM-DD 형태로 전송',
  })
  @IsString()
  date: string;
}
