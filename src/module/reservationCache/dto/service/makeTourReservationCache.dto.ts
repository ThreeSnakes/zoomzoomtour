import { Tour } from '../../../tour/domain/tour.domain';

export class MakeTourReservationCacheDto {
  tour: Tour;
  year: number;
  month: number;
}
