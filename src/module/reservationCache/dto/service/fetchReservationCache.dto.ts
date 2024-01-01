import { Tour } from '../../../tour/domain/tour.domain';

export class FetchReservationCacheDto {
  tour: Tour;
  year: number;
  month: number;
}
