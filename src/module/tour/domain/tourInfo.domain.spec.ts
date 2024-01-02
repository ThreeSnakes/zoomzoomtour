import { Tour } from './tour.domain';
import { Seller } from '../../seller/domain/seller.domain';
import { Holiday } from './holiday.domain';
import * as dayjs from 'dayjs';
import { RegularHoliday } from './regularHoliday.domain';
import { TourInfo } from './tourInfo.domain';

const MOCK_SELLER = new Seller({
  name: 'test_seller',
});
const MOCK_TOUR = new Tour({
  name: 'test_name',
  description: 'test_description',
  seller: MOCK_SELLER,
});
const MOCK_HOLIDAYS = [
  new Holiday({
    date: dayjs('2024-01-01 00:00:00'),
    tour: MOCK_TOUR,
  }),
  new Holiday({
    date: dayjs('2024-01-02 00:00:00'),
    tour: MOCK_TOUR,
  }),
];
const MOCK_REGULAR_HOLIDAYS = [
  new RegularHoliday({
    day: 0,
    tour: MOCK_TOUR,
  }),
  new RegularHoliday({
    day: 5,
    tour: MOCK_TOUR,
  }),
];

describe('TourInfoDomain 생성 Test ', () => {
  expect(
    () =>
      new TourInfo({
        id: 1,
        name: 'test_name',
        description: 'test_description',
        seller: MOCK_SELLER,
        holidays: MOCK_HOLIDAYS,
        regularHolidays: MOCK_REGULAR_HOLIDAYS,
        ctime: dayjs('2024-01-01 00:00:00'),
        mtime: dayjs('2024-01-01 00:00:00'),
      }),
  ).not.toThrow();
});

describe('TourInfoDomain isTourHoliday() Method Test', () => {
  const tourInfo = new TourInfo({
    id: 1,
    name: 'test_name',
    description: 'test_description',
    seller: MOCK_SELLER,
    holidays: MOCK_HOLIDAYS,
    regularHolidays: MOCK_REGULAR_HOLIDAYS,
    ctime: dayjs('2024-01-01 00:00:00'),
    mtime: dayjs('2024-01-01 00:00:00'),
  });

  it('입력받은 날짜가 휴일인 경우 true를 리턴하고, 휴일이 아닌 경우 false를 리턴한다.', () => {
    expect([
      tourInfo.isTourHoliday('2024-01-01'),
      tourInfo.isTourHoliday('2024-01-02'),
      tourInfo.isTourHoliday('2024-01-03'),
      tourInfo.isTourHoliday('2024-01-04'),
      tourInfo.isTourHoliday('2024-01-05'),
      tourInfo.isTourHoliday('2024-01-06'),
      tourInfo.isTourHoliday('2024-01-07'),
      tourInfo.isTourHoliday('2024-01-08'),
      tourInfo.isTourHoliday('2024-01-09'),
    ]).toEqual([true, true, false, false, true, false, true, false, false]);
  });
});
