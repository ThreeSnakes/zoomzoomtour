import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ApproveReservationDto {
  @ApiProperty({
    description: 'Seller ID, SELLER의 ID 값',
    minimum: 0,
  })
  @IsNumber()
  sellerId: number;
}
