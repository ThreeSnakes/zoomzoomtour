import { Seller } from '../../seller/domain/seller.domain';
import { Tour } from './tour.domain';
import * as dayjs from 'dayjs';
import { RegularHoliday } from './regularHoliday.domain';

const MOCK_SELLER = new Seller({
  name: 'test_seller',
});
const MOCK_TOUR = new Tour({
  name: 'test_name',
  description: 'test_description',
  seller: MOCK_SELLER,
});

describe('RegularHolidayDomain 생성 Test', () => {
  it('RegularHolidayDomain 객체가 생성된다.', () => {
    expect(() => {
      new RegularHoliday({
        day: 0,
        tour: MOCK_TOUR,
      });
    }).not.toThrow();
  });
});

describe('RegularHoliday Method Test', () => {
  const regularHoliday = new RegularHoliday({
    day: 0,
    tour: MOCK_TOUR,
  });

  it('get day()', () => {
    expect(regularHoliday.day).toBe(0);
  });

  it('getDateByReadable()', () => {
    expect(regularHoliday.getDateByReadable()).toBe('SUN');
  });
});

describe('RegularHoliday isRegularHoliday() Method Test', () => {
  const regularHoliday = new RegularHoliday({
    day: 0,
    tour: MOCK_TOUR,
  });

  it('입력받은 날짜가 같은 요일인 경우 ture를 리턴한다.', () => {
    expect(regularHoliday.isRegularHoliday(dayjs('2024-01-07 00:00:00'))).toBe(
      true,
    );
  });

  it('입력받은 날짜가 다른 요일인 경우 false를 리턴한다.', () => {
    expect([
      regularHoliday.isRegularHoliday(dayjs('2024-01-01 00:00:00')),
      regularHoliday.isRegularHoliday(dayjs('2024-01-02 00:00:00')),
      regularHoliday.isRegularHoliday(dayjs('2024-01-03 00:00:00')),
      regularHoliday.isRegularHoliday(dayjs('2024-01-04 00:00:00')),
      regularHoliday.isRegularHoliday(dayjs('2024-01-05 00:00:00')),
      regularHoliday.isRegularHoliday(dayjs('2024-01-06 00:00:00')),
    ]).toEqual([false, false, false, false, false, false]);
  });
});
