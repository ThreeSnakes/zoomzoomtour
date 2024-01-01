import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTourReservationCalendarRequestDto {
  @ApiProperty({
    description: '조회 년',
  })
  @Min(2000)
  @Max(3000)
  @IsNumber()
  @Transform((value) => {
    return +value.value;
  })
  year: number;

  @ApiProperty({
    description: '조회 월',
  })
  @Min(0)
  @Max(11)
  @IsNumber()
  @Transform((value) => {
    return +value.value;
  })
  month: number;
}
