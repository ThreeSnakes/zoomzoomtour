import { DAY_OF_WEEK } from '../api/CreateTour.dto';

export class CreateNewTourDto {
  clientId: number;
  tourName: string;
  tourDescription: string;
  tourRegularHoliday?: DAY_OF_WEEK[];
  tourHoliday?: string[];
}
