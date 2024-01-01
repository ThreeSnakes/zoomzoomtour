import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { DAY_OF_WEEK } from '../../domain/regularHoliday.domain';

export class CreateTourRequestDto {
  @ApiProperty({
    description: 'Seller ID',
  })
  @Min(1)
  @IsNumber()
  sellerId: number;

  @ApiProperty({
    description: 'tour name',
    minLength: 5,
    maxLength: 100,
  })
  @MinLength(5)
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'tour description',
    minLength: 5,
    maxLength: 200,
  })
  @MinLength(5)
  @MaxLength(200)
  @IsString()
  description: string;

  @ApiProperty({
    description:
      '해당 투어의 정기 휴일, SUN(0), MON(1), TUE(2), WED(3), THU(4), FRI(5), SAT(6) 중 쉬는 날을 array에 넣어서 보낸다.',
    example: [0, 1],
  })
  @IsOptional()
  regularHoliday?: DAY_OF_WEEK[];

  @ApiProperty({
    description:
      '해당 투어의 특정 휴일, YYYY-MM-DD 형태로 array에 넣어서 보낸다.',
    example: ['2024-01-01', '2024-03-01'],
  })
  @IsOptional()
  holiday?: string[];
}
