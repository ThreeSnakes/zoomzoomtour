import * as dayjs from 'dayjs';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { RegularHolidayEntity } from '../../../infra/database/entity/regularHoliday.entity';
import { HolidayEntity } from '../../../infra/database/entity/holiday.entity';
import { RegularHoliday } from './regularHoliday.domain';
import { Holiday } from './holiday.domain';
import { Seller } from '../../seller/seller.domain';

type PARAM = {
  id?: number;
  name: string;
  seller: Promise<SellerEntity>;
  regularHolidays?: Promise<RegularHolidayEntity[]>;
  holidays?: Promise<HolidayEntity[]>;
  description: string;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Tour {
  private readonly _id: number;
  private readonly _seller: Promise<SellerEntity>;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _regularHolidays: Promise<RegularHolidayEntity[]>;
  private readonly _holidays: Promise<HolidayEntity[]>;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: TourEntity) {
    return new Tour({
      id: entity.id,
      seller: entity.seller,
      name: entity.name,
      regularHolidays: entity.regularHoliday,
      holidays: entity.holiday,
      description: entity.description,
      mtime: dayjs(entity.mtime),
      ctime: dayjs(entity.ctime),
    });
  }

  constructor(param: PARAM) {
    const {
      id,
      name,
      seller,
      description,
      mtime,
      ctime,
      regularHolidays,
      holidays,
    } = param;

    if (!name || name.length < 5 || name.length > 100) {
      throw new Error(
        'name should be greater than or equal to 5 and less than or equal 100',
      );
    }

    if (!description || description.length < 5 || description.length > 200) {
      throw new Error(
        'description should be greater than or equal to 5 and less than or equal 200',
      );
    }

    this._id = id;
    this._seller = seller;
    this._name = name;
    this._description = description;
    this._regularHolidays = regularHolidays;
    this._holidays = holidays;
    this._mtime = mtime;
    this._ctime = ctime;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  async seller() {
    const sellerEntity = await Promise.resolve(this._seller);

    return Seller.createFromEntity(sellerEntity);
  }

  async regularHolidays() {
    const regularHolidayEntities = await Promise.resolve(this._regularHolidays);

    return regularHolidayEntities?.map((regularHoliday) =>
      RegularHoliday.createFromEntity(regularHoliday),
    );
  }

  async holidays() {
    const holidayEntities = await Promise.resolve(this._holidays);

    return holidayEntities?.map((holiday) => Holiday.createFromEntity(holiday));
  }

  async isValidTourDate(date: string) {
    const [regularHolidays, holidays] = await Promise.all([
      this.regularHolidays(),
      this.holidays(),
    ]);

    const isHoliday = holidays?.some((holiday) => holiday.isEqual(date));

    if (isHoliday) {
      throw new Error(`해당 날짜(${date})는 휴일입니다.`);
    }

    const isRegularHoliday = regularHolidays?.some((regularHoliday) =>
      regularHoliday.isRegularHoliday(date),
    );

    if (isRegularHoliday) {
      throw new Error('해당 요일은 정기 휴일입니다.');
    }
  }

  toEntity() {
    const entity = new TourEntity();
    entity.id = this._id;
    entity.name = this._name;
    entity.description = this._description;
    entity.seller = this._seller;
    entity.holiday = this._holidays;
    entity.regularHoliday = this._regularHolidays;
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }
}
