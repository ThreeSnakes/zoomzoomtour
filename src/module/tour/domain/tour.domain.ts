import * as dayjs from 'dayjs';
import { Seller } from '../../seller/domain/seller.domain';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

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

    const parsedName = name.trim();
    if (parsedName.length < 5 || parsedName.length > 100) {
      throw new BadRequestException(
        '투어명은 5자 이상, 100자 이하로 입력되어야 합니다.',
      );
    }

    const parsedDescription = description.trim();
    if (parsedDescription.length < 5 || parsedDescription.length > 200) {
      throw new BadRequestException(
        '투어 설명은 5자 이상, 200자 이하로 입력되어야 합니다.',
      );
    }

    this._id = id;
    this._seller = seller;
    this._name = parsedName;
    this._description = parsedDescription;
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
