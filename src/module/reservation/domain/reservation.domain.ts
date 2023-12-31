import * as dayjs from 'dayjs';
import { ReservationEntity } from '../../../infra/database/entity/reservation.entity';
import { Tour } from '../../tour/domain/tour.domain';
import { Client } from '../../client/domain/client.domain';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export enum RESERVATION_STATE {
  WAIT = 'WAIT', // 대기
  APPROVE = 'APPROVE', // 승인,
  CANCEL = 'CANCEL', // 취소,
}

type PARAM = {
  token?: string;
  client: Client;
  tour: Tour;
  state: RESERVATION_STATE;
  date: dayjs.Dayjs;
  ctime?: dayjs.Dayjs;
  mtime?: dayjs.Dayjs;
};

export class Reservation {
  private readonly _token: string;
  private readonly _client: Client;
  private readonly _tour: Tour;
  private _state: RESERVATION_STATE;
  private readonly _date: dayjs.Dayjs;
  private readonly _ctime: dayjs.Dayjs;
  private readonly _mtime: dayjs.Dayjs;

  static async createFromEntity(entity: ReservationEntity) {
    return new Reservation({
      token: entity.token,
      client: Client.createFromEntity(await entity.client),
      tour: await Tour.createFromEntity(await entity.tour),
      state: entity.state,
      date: dayjs(entity.date),
      ctime: dayjs(entity.ctime),
      mtime: dayjs(entity.mtime),
    });
  }

  constructor(param: PARAM) {
    const { token, client, tour, state, date, ctime, mtime } = param;
    this._token = token;
    this._client = client;
    this._tour = tour;
    this._state = state;
    this._date = date;
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
    return this._date;
  }

  get tour() {
    return this._tour;
  }

  public approve() {
    if (this._state !== RESERVATION_STATE.WAIT) {
      throw new BadRequestException('예약이 대기 상태가 아닙니다.');
    }

    this._state = RESERVATION_STATE.APPROVE;
  }

  public cancel() {
    if (this._state !== RESERVATION_STATE.APPROVE) {
      throw new BadRequestException('에약이 승인 상태가 아닙니다.');
    }

    const cancelAvailableDate = dayjs(this._date, 'YYYY-MM-DD')
      .add(-3, 'days')
      .startOf('date');
    const today = dayjs().startOf('date');

    if (cancelAvailableDate < today) {
      throw new BadRequestException(
        '예약을 취소 할 수 없습니다. 예약은 3일전 까지만 취소가 가능합니다.',
      );
    }

    this._state = RESERVATION_STATE.CANCEL;
  }

  toEntity(): ReservationEntity {
    const entity = new ReservationEntity();
    entity.token = this._token;
    entity.client = Promise.resolve(this._client.toEntity());
    entity.tour = Promise.resolve(this._tour.toEntity());
    entity.state = this._state;
    entity.date = this._date?.toDate();
    entity.ctime = this._ctime?.toDate();
    entity.mtime = this._mtime?.toDate();

    return entity;
  }
}
