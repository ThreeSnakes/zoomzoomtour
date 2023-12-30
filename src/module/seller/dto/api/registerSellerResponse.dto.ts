import { ApiProperty } from '@nestjs/swagger';

export class RegisterSellerResponseDto {
  @ApiProperty({
    description: 'Seller ID',
  })
  id: number;

  @ApiProperty({
    description: 'Seller Name',
  })
  name: string;
}
