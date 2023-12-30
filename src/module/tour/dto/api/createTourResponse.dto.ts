import { ApiProperty } from '@nestjs/swagger';

export class CreateTourResponseDto {
  @ApiProperty({
    description: 'Tour ID',
  })
  id: number;

  @ApiProperty({
    description: 'Tour name',
  })
  name: string;

  @ApiProperty({
    description: 'Tour Description',
  })
  description: string;

  @ApiProperty({
    description: '해당 투어 정기 휴일',
  })
  regularHolidays: string[];

  @ApiProperty({
    description: '해당 투어 휴일',
  })
  holidays: string[];
}
