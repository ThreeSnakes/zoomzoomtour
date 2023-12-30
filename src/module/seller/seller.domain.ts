import * as dayjs from 'dayjs';
import { SellerEntity } from '../../infra/database/entity/seller.entity';

type PARAM = {
  id?: number;
  name: string;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Seller {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: SellerEntity) {
    return new Seller({
      id: entity.id,
      name: entity.name,
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    const { id, name, ctime, mtime } = param;

    if (!name || name.length < 5) {
      throw new Error('name should be greater than or equal to 5');
    }

    this._id = id;
    this._name = name;
    this._ctime = ctime;
    this._mtime = mtime;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  toEntity(): SellerEntity {
    const entity = new SellerEntity();
    entity.id = this._id;
    entity.name = this._name;
    entity.mtime = this._mtime?.toDate();
    entity.ctime = this._ctime?.toDate();

    return entity;
  }
}
