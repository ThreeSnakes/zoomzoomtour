import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { TourEntity } from '../../../infra/database/entity/tour.entity';
import * as dayjs from 'dayjs';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Tour } from '../../tour/domain/tour.domain';

export enum RESERVATION_STATE {
  WAIT = 'WAIT', // 대기
  APPROVE = 'APPROVE', // 승인,
  CANCEL = 'CANCEL', // 취소,
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

  get date() {
    return dayjs(this._date);
  }

  async tour() {
    const tourEntity = await Promise.resolve(this._tour);

    return Tour.createFromEntity(tourEntity);
  }

  public approve() {
    if (this._state !== RESERVATION_STATE.WAIT) {
      throw new Error('예약이 대기 상태가 아닙니다.');
    }

    this._state = RESERVATION_STATE.APPROVE;
  }

  public cancel() {
    if (this._state !== RESERVATION_STATE.APPROVE) {
      throw new Error('에약이 승인 상태가 아닙니다.');
    }

    const cancelAvailableDate = dayjs(this._date, 'YYYY-MM-DD')
      .add(-3, 'days')
      .startOf('date');
    const today = dayjs().startOf('date');

    if (cancelAvailableDate < today) {
      throw new Error(
        '예약을 취소 할 수 없습니다. 예약은 3일전 까지만 취소가 가능합니다.',
      );
    }

    this._state = RESERVATION_STATE.CANCEL;
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
