import { Seller } from '../../seller/domain/seller.domain';
import { Tour } from './tour.domain';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import * as dayjs from 'dayjs';

const MOCK_SELLER = new Seller({
  name: 'test_seller',
});

describe('HolidayDomain 생성 Test', () => {
  it('name이 5글자 이하인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Tour({
          name: 'test',
          description: 'test_description',
          seller: MOCK_SELLER,
        }),
    ).toThrowError(
      new BadRequestException(
        '투어명은 5자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });
  it('name이 100글자 이상인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Tour({
          name: 'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde',
          description: 'test_description',
          seller: MOCK_SELLER,
        }),
    ).toThrowError(
      new BadRequestException(
        '투어명은 5자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });
  it('description이 200자 이상인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Tour({
          name: 'test_name',
          description: 'test',
          seller: MOCK_SELLER,
        }),
    ).toThrowError(
      new BadRequestException(
        '투어 설명은 5자 이상, 200자 이하로 입력되어야 합니다.',
      ),
    );
  });
  it('description이 100글자 이상인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Tour({
          name: 'test_name',
          description:
            'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde',
          seller: MOCK_SELLER,
        }),
    ).toThrowError(
      new BadRequestException(
        '투어 설명은 5자 이상, 200자 이하로 입력되어야 합니다.',
      ),
    );
  });
  it('HolidayDomain 객체가 생성된다.', () => {
    expect(() => {
      new Tour({
        name: 'test_name',
        description: 'test_description',
        seller: MOCK_SELLER,
      });
    }).not.toThrow();
  });
});

describe('TourDomain Method Test', () => {
  const tour = new Tour({
    id: 1,
    name: 'test_name',
    description: 'test_description',
    seller: MOCK_SELLER,
    mtime: dayjs('2024-01-01'),
    ctime: dayjs('2024-01-01'),
  });

  it('get id()', () => {
    expect(tour.id).toBe(1);
  });

  it('get name()', () => {
    expect(tour.name).toBe('test_name');
  });

  it('get name()', () => {
    expect(tour.description).toBe('test_description');
  });

  it('get seller()', () => {
    expect(tour.seller).toBe(MOCK_SELLER);
  });

  it('get mtime()', () => {
    expect(tour.mtime).toEqual(dayjs('2024-01-01'));
  });

  it('get ctime()', () => {
    expect(tour.mtime).toEqual(dayjs('2024-01-01'));
  });
});
