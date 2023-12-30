import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import * as dayjs from 'dayjs';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Tour } from '../../tour/domain/tour.domain';

export enum RESERVATION_STATE {
  WAIT = 'WAIT', // 대기
  APPROVE = 'APPROVE', // 승인,
}

type PARAM = {
  token?: string;
  client: Promise<ClientEntity>;
  tour: Promise<TourEntity>;
  state: RESERVATION_STATE;
  date: string;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Reservation {
  private readonly _token: string;
  private readonly _client: Promise<ClientEntity>;
  private readonly _tour: Promise<TourEntity>;
  private _state: RESERVATION_STATE;
  private readonly _date: string;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static createFromEntity(entity: ReservationEntity) {
    return new Reservation({
      token: entity.token,
      client: entity.client,
      tour: entity.tour,
      state: entity.state,
      date: entity.date,
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    const { token, client, tour, state, ctime, mtime } = param;

    const date = dayjs(param.date, 'YYYY-MM-DD');

    if (!date.isValid()) {
      throw new Error('Invalid Date');
    }

    this._token = token;
    this._client = client;
    this._tour = tour;
    this._state = state;
    this._date = date.format('YYYY-MM-DD');
    this._ctime = ctime;
    this._mtime = mtime;
  }

  get token() {
    return this._token;
  }

  get state() {
    return this._state;
  }

  set state(state: RESERVATION_STATE) {
    this._state = state;
  }

  async tour() {
    const tourEntity = await Promise.resolve(this._tour);

    return Tour.createFromEntity(tourEntity);
  }

  toEntity(): ReservationEntity {
    const entity = new ReservationEntity();
    entity.token = this._token;
    entity.client = this._client;
    entity.tour = this._tour;
    entity.state = this._state;
    entity.date = this._date;
    entity.ctime = this._ctime?.toDate();
    entity.mtime = this._mtime?.toDate();

    return entity;
  }
}
