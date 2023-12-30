import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientResponseDto {
  @ApiProperty({
    description: 'Client ID',
  })
  id: number;

  @ApiProperty({
    description: 'Client Name',
  })
  name: string;
}
