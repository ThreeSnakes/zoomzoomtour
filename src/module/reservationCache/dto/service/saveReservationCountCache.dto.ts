import { Tour } from '../../../tour/domain/tour.domain';

export class SaveReservationCountCacheDto {
  tour: Tour;
  reservationDate: string;
  token: string;
}
