import { TourInfo } from '../../domain/tourInfo.domain';

export type TOUR_CALENDAR = Record<string, number>;
export class FetchTourCalendarResponseDto {
  tourInfo: TourInfo;
  tourCalendar: TOUR_CALENDAR;
}
