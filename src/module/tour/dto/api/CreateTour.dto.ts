import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum DAY_OF_WEEK {
  'SUN' = 'SUN',
  'MON' = 'MON',
  'TUE' = 'TUE',
  'WED' = 'WED',
  'THU' = 'THU',
  'FRI' = 'FRI',
  'SAT' = 'SAT',
}

export class CreateTourDto {
  @ApiProperty({
    description: 'clientId',
  })
  @Min(1)
  @IsNumber()
  client_id: number;

  @ApiProperty({
    description: 'tour name',
    minLength: 0,
    maxLength: 100,
  })
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'tour description',
    minLength: 0,
    maxLength: 200,
  })
  @MinLength(1)
  @MaxLength(200)
  @IsString()
  description: string;

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
