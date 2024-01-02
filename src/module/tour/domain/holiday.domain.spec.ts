import { Tour } from './tour.domain';
import { Seller } from '../../seller/domain/seller.domain';
import { Holiday } from './holiday.domain';
import * as dayjs from 'dayjs';

const MOCK_SELLER = new Seller({
  name: 'test_seller',
});
const MOCK_TOUR = new Tour({
  name: 'test_name',
  description: 'test_description',
  seller: MOCK_SELLER,
});

describe('HolidayDomain 생성 Test', () => {
  it('HolidayDomain 객체가 생성된다.', () => {
    expect(() => {
      new Holiday({
        date: dayjs('2024-01-01 00:00:00'),
        tour: MOCK_TOUR,
      });
    }).not.toThrow();
  });
});

describe('Holiday Method Test', () => {
  const holiday = new Holiday({
    date: dayjs('2024-01-01 00:00:00'),
    tour: MOCK_TOUR,
  });

  it('get date()', () => {
    expect(holiday.date).toBe('2024-01-01');
  });
});

describe('Holiday isHoliday() Method Test', () => {
  const holiday = new Holiday({
    date: dayjs('2024-01-01 00:00:00'),
    tour: MOCK_TOUR,
  });

  it('입력받은 날짜가 같은 날짜인 경우 ture를 리턴한다.', () => {
    expect(holiday.isHoliday(dayjs('2024-01-01 00:00:00'))).toBe(true);
  });

  it('입력받은 날짜가 다른 날짜인 경우 false를 리턴한다.', () => {
    expect(holiday.isHoliday(dayjs('2024-01-03 00:00:00'))).toBe(false);
  });
});
