import { DAY_OF_WEEK } from '../../domain/regularHoliday.domain';

export class ModifyTourHolidaysRequestDto {
  tourId: number;
  regularHolidays?: DAY_OF_WEEK[];
  holidays?: string[];
}
