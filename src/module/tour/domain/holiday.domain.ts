import * as dayjs from 'dayjs';
import { HolidayEntity } from '../../../infra/database/entity/holiday.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';

type PARAM = {
  id?: number;
  date: string;
  tour: Promise<TourEntity>;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Holiday {
  private readonly _id: number;
  private readonly _date: string;
  private readonly _tour: Promise<TourEntity>;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: HolidayEntity): Holiday {
    return new Holiday({
      id: entity.id,
      date: entity.date,
      tour: entity.tour,
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    const date = dayjs(param.date, 'MM-DD');

    if (!date.isValid()) {
      throw new Error('Invalid Date');
    }

    this._id = param.id;
    this._date = date.format('MM-DD');
    this._tour = param.tour;
    this._ctime = param.ctime;
    this._mtime = param.mtime;
  }

  get date() {
    return this._date;
  }

  toEntity(): HolidayEntity {
    const entity = new HolidayEntity();
    entity.id = this._id;
    entity.date = this._date;
    entity.tour = this._tour;
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }
}
