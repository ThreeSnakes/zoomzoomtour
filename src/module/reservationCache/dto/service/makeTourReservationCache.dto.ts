import { TourInfo } from '../../../tour/domain2/tourInfo.domain';

export class MakeTourReservationCacheDto {
  tourInfo: TourInfo;
  year: number;
  month: number;
}
