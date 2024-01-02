import * as dayjs from 'dayjs';
import { Seller } from '../../seller/domain/seller.domain';
import { TourEntity } from '../../../infra/database/entity/tour.entity';

type PARAM = {
  id?: number;
  name: string;
  description: string;
  seller: Seller;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Tour {
  private readonly _id: number;
  private readonly _seller: Seller;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static async createFromEntity(entity: TourEntity): Promise<Tour> {
    return new Tour({
      id: entity.id,
      seller: Seller.createFromEntity(await entity.seller),
      name: entity.name,
      description: entity.description,
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    const { id, name, seller, description, mtime, ctime } = param;

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

  get seller() {
    return this._seller;
  }

  get mtime() {
    return this._mtime;
  }

  get ctime() {
    return this._ctime;
  }

  toEntity() {
    const entity = new TourEntity();
    entity.id = this._id;
    entity.name = this._name;
    entity.description = this._description;
    entity.seller = Promise.resolve(this._seller.toEntity());
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }
}
