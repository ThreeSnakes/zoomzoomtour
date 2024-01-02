import { Tour } from './tour.domain';
import { Holiday } from './holiday.domain';
import { RegularHoliday } from './regularHoliday.domain';
import { Seller } from '../../seller/domain/seller.domain';
import * as dayjs from 'dayjs';

type PARAM = {
  id?: number;
  name: string;
  description: string;
  seller: Seller;
  holidays: Holiday[];
  regularHolidays: RegularHoliday[];
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

type CREATE_FROM_TOUR_PARAM = {
  tour: Tour;
  holidays: Holiday[];
  regularHolidays: RegularHoliday[];
};
export class TourInfo extends Tour {
  private readonly _holidays: Holiday[];
  private readonly _regularHolidays: RegularHoliday[];

  static createFromTour({
    tour,
    holidays,
    regularHolidays,
  }: CREATE_FROM_TOUR_PARAM) {
    return new TourInfo({
      id: tour.id,
      name: tour.name,
      description: tour.description,
      seller: tour.seller,
      holidays,
      regularHolidays,
      mtime: tour.mtime,
      ctime: tour.ctime,
    });
  }

  constructor(param: PARAM) {
    const { holidays, regularHolidays, ...parentParam } = param;
    super(parentParam);
    this._holidays = holidays;
    this._regularHolidays = regularHolidays;
  }

  get holidays() {
    return this._holidays;
  }

  get regularHolidays() {
    return this._regularHolidays;
  }

  isTourHoliday(dateString: string) {
    const date = dayjs(dateString, 'YYYY-MM-DD');

    const isHoliday = this._holidays?.some((holiday) =>
      holiday.isHoliday(date),
    );
    const isRegularHoliday = this._regularHolidays?.some((regularHoliday) => {
      regularHoliday.isRegualrHoliday(date);
    });

    return isHoliday || isRegularHoliday;
  }
}
