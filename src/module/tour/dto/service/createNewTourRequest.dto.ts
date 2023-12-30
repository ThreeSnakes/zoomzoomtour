import { DAY_OF_WEEK } from '../../domain/regularHoliday.domain';

export class CreateNewTourRequestDto {
  sellerId: number;
  tourName: string;
  tourDescription: string;
  tourRegularHoliday?: DAY_OF_WEEK[];
  tourHoliday?: string[];
}
