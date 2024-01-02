import { Tour } from './tour.domain';
import * as dayjs from 'dayjs';
import { HolidayEntity } from '../../../infra/database/entity/holiday.entity';

type PARAM = {
  id?: number;
  date: dayjs.Dayjs;
  tour: Tour;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Holiday {
  private readonly _id: number;
  private readonly _tour: Tour;
  private readonly _date: dayjs.Dayjs;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static async createFromEntity(entity: HolidayEntity): Promise<Holiday> {
    return new Holiday({
      id: entity.id,
      date: dayjs(entity.date, 'YYYY-MM-DD'),
      tour: await Tour.createFromEntity(await entity.tour),
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    this._id = param.id;
    this._date = param.date;
    this._tour = param.tour;
    this._ctime = param.ctime;
    this._mtime = param.mtime;
  }

  toEntity(): HolidayEntity {
    const entity = new HolidayEntity();
    entity.id = this._id;
    entity.date = this._date.format('YYYY-MM-DD');
    entity.tour = Promise.resolve(this._tour.toEntity());
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }

  get date() {
    return this._date.format('YYYY-MM-DD');
  }

  isHoliday(date: dayjs.Dayjs): boolean {
    return date.isSame(this._date);
  }
}
