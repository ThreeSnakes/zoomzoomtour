import { ApiProperty } from '@nestjs/swagger';
import { DAY_OF_WEEK } from '../../domain/regularHoliday.domain';

export class ModifyTourHolidaysResponseDto {
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
  regularHolidays: DAY_OF_WEEK[];

  @ApiProperty({
    description: '해당 투어 휴일',
  })
  holidays: string[];
}
