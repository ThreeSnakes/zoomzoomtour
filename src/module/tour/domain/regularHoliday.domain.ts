import * as dayjs from 'dayjs';
import { RegularHolidayEntity } from '../../../infra/database/entity/regularHoliday.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';

type PARAM = {
  id?: number;
  day: DAY_OF_WEEK;
  tour: Promise<TourEntity>;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export enum DAY_OF_WEEK {
  'SUN' = 0,
  'MON' = 1,
  'TUE' = 2,
  'WED' = 3,
  'THU' = 4,
  'FRI' = 5,
  'SAT' = 6,
}

export class RegularHoliday {
  private readonly _id: number;
  private readonly _day: DAY_OF_WEEK;
  private readonly _tour: Promise<TourEntity>;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: RegularHolidayEntity): RegularHoliday {
    return new RegularHoliday({
      id: entity.id,
      day: entity.day,
      tour: entity.tour,
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    this._id = param.id;
    this._day = param.day;
    this._tour = param.tour;
    this._ctime = param.ctime;
    this._mtime = param.mtime;
  }

  get id() {
    return this._id;
  }

  get day() {
    return this._day;
  }

  isRegularHoliday(day) {
    const targetDay = dayjs(day).day();

    return targetDay === this._day;
  }

  toEntity(): RegularHolidayEntity {
    const entity = new RegularHolidayEntity();
    entity.id = this._id;
    entity.day = this._day;
    entity.tour = this._tour;
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }
}
