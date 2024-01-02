import * as dayjs from 'dayjs';
import { Reservation, RESERVATION_STATE } from './reservation.domain';
import { Client } from '../../client/domain/client.domain';
import { Tour } from '../../tour/domain/tour.domain';
import { Seller } from '../../seller/domain/seller.domain';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

const MOCK_CLIENT = new Client({
  name: 'test_client',
});
const MOCK_SELLER = new Seller({
  name: 'test_seller',
});
const MOCK_TOUR = new Tour({
  name: 'test_name',
  description: 'test_description',
  seller: MOCK_SELLER,
});

describe('ReservationDomain 생성 Test', () => {
  it('Reservation 객체가 생성된다.', () => {
    expect(
      () =>
        new Reservation({
          token: 'test_token',
          client: MOCK_CLIENT,
          tour: MOCK_TOUR,
          state: 'APPROVE' as RESERVATION_STATE,
          date: dayjs(new Date()),
        }),
    ).not.toThrow();
  });
});

describe('ReservationDomain Method Test', () => {
  const reservation = new Reservation({
    token: 'test_token',
    client: MOCK_CLIENT,
    tour: MOCK_TOUR,
    state: 'APPROVE' as RESERVATION_STATE,
    date: dayjs('2024-01-01 00:00:00'),
  });

  it('get token()', () => {
    expect(reservation.token).toBe('test_token');
  });

  it('get state()', () => {
    expect(reservation.state).toBe('APPROVE');
  });

  it('get date()', () => {
    expect(reservation.date).toEqual(dayjs('2024-01-01 00:00:00'));
  });

  it('get tour()', () => {
    expect(reservation.tour).toEqual(MOCK_TOUR);
  });
});

describe('ReservationDomain approve() Method', () => {
  it('APPROVE 상태에서 승인 하는 경우 에러를 리턴한다.', () => {
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'APPROVE' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.approve()).toThrow(
      new BadRequestException('예약이 대기 상태가 아닙니다.'),
    );
  });

  it('CANCEL 상태에서 승인 하는 경우 에러를 리턴한다.', () => {
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'CANCEL' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.approve()).toThrow(
      new BadRequestException('예약이 대기 상태가 아닙니다.'),
    );
  });

  it('WAIT 상태에서 승인 하는 경우 정상 처리 된다.', () => {
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'WAIT' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.approve()).not.toThrow();
  });
});

describe('ReservationDomain cancel() Method', () => {
  it('WAIT 상태에서 취소를 요청하면 에러가 발생한다.', () => {
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'WAIT' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.cancel()).toThrow(
      new BadRequestException('에약이 승인 상태가 아닙니다.'),
    );
  });

  it('CANCEL 상태에서 취소를 요청하면 에러가 발생한다.', () => {
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'CANCEL' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.cancel()).toThrow(
      new BadRequestException('에약이 승인 상태가 아닙니다.'),
    );
  });

  it('현재 날짜가 예약날짜 3일 이내인 경우 에러를 리턴한다.', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'APPROVE' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.cancel()).toThrow(
      new BadRequestException(
        '예약을 취소 할 수 없습니다. 예약은 3일전 까지만 취소가 가능합니다.',
      ),
    );
  });

  it('취소 가능한 날짜인 경우 에러를 리턴한다.', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
    const reservation = new Reservation({
      token: 'test_token',
      client: MOCK_CLIENT,
      tour: MOCK_TOUR,
      state: 'APPROVE' as RESERVATION_STATE,
      date: dayjs('2024-01-01 00:00:00'),
    });

    expect(() => reservation.cancel()).not.toThrow();
  });
});
