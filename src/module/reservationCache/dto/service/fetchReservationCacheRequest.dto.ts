import { TourInfo } from '../../../tour/domain/tourInfo.domain';

export class FetchReservationCacheRequestDto {
  tourInfo: TourInfo;
  year: number;
  month: number;
}
