import { TourInfo } from '../../../tour/domain/tourInfo.domain';

export class MakeTourReservationCacheDto {
  tourInfo: TourInfo;
  year: number;
  month: number;
}
