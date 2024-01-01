import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DAY_OF_WEEK } from '../../domain/regularHoliday.domain';

export class ModifyTourHolidaysRequestDto {
  @ApiProperty({
    description:
      '해당 투어의 정기 휴일, SUN, MON, TUE, WED, THU, FRI, SAT 중 쉬는 날을 array에 넣어서 보낸다.',
    example: ['MON', 'TUE'],
  })
  @IsOptional()
  regularHoliday?: DAY_OF_WEEK[];

  @ApiProperty({
    description: '해당 투어의 특정 휴일, MM-DD 형태로 array에 넣어서 보낸다.',
    example: ['01-01', '03-01'],
  })
  @IsOptional()
  holiday?: string[];
}
