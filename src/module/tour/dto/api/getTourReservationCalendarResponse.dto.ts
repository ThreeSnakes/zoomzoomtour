import { ApiProperty } from '@nestjs/swagger';
import {
  DAY_OF_READABLE,
  DAY_OF_WEEK,
} from '../../domain/regularHoliday.domain';
import { TOUR_CALENDAR } from '../service/fetchTourCalendarResponse.dto';

export class GetTourReservationCalendarResponseDto {
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
  regularHolidays: DAY_OF_READABLE[];

  @ApiProperty({
    description: '해당 투어 휴일',
  })
  holidays: string[];

  @ApiProperty({
    description: '예약 가능 날짜 Count',
    type: 'TOUR_CALENDAR',
  })
  calendar: TOUR_CALENDAR;
}
