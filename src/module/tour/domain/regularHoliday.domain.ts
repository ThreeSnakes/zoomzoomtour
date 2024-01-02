import * as dayjs from 'dayjs';
import { Tour } from './tour.domain';
import { RegularHolidayEntity } from '../../../infra/database/entity/regularHoliday.entity';

type PARAM = {
  id?: number;
  day: DAY_OF_WEEK;
  tour: Tour;
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

export type DAY_OF_READABLE =
  | 'SUN'
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT';

export class RegularHoliday {
  private readonly _id: number;
  private readonly _tour: Tour;
  private readonly _day: DAY_OF_WEEK;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static async createFromEntity(
    entity: RegularHolidayEntity,
  ): Promise<RegularHoliday> {
    return new RegularHoliday({
      id: entity.id,
      day: entity.day,
      tour: await Tour.createFromEntity(await entity.tour),
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

  toEntity(): RegularHolidayEntity {
    const entity = new RegularHolidayEntity();
    entity.id = this._id;
    entity.day = this._day;
    entity.tour = Promise.resolve(this._tour.toEntity());
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }

  get day() {
    return this._day;
  }

  getDateByReadable(): DAY_OF_READABLE {
    switch (this._day) {
      case 0:
        return 'SUN';
      case 1:
        return 'MON';
      case 2:
        return 'TUE';
      case 3:
        return 'WED';
      case 4:
        return 'THU';
      case 5:
        return 'FRI';
      case 6:
        return 'SAT';
    }
  }

  isRegularHoliday(date: dayjs.Dayjs) {
    return this._day === date.day();
  }
}
