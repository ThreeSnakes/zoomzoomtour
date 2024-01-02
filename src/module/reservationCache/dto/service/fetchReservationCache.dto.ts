import { TourInfo } from '../../../tour/domain/tourInfo.domain';

export class FetchReservationCacheDto {
  tourInfo: TourInfo;
  year: number;
  month: number;
}
