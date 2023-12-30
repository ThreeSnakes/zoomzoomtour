import * as dayjs from 'dayjs';
import { ClientEntity } from '../../infra/database/entity/client.entity';

type PARAM = {
  id?: number;
  name: string;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Client {
  private readonly _id?: number;
  private readonly _name: string;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: ClientEntity) {
    return new Client({
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

  toEntity(): ClientEntity {
    const entity = new ClientEntity();
    entity.id = this._id;
    entity.name = this._name;
    entity.ctime = this._ctime?.toDate();
    entity.mtime = this._mtime?.toDate();

    return entity;
  }
}
