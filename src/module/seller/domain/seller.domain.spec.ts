import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Seller } from './seller.domain';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';

describe('SellerDomain 생성 Test', () => {
  it('name이 5글자 이하인 경우 Error를 리턴한다.', () => {
    expect(() => new Seller({ name: 'test' })).toThrowError(
      new BadRequestException(
        '판매자명은 5자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });

  it('name이 100글자 이상인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Seller({
          name: 'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde',
        }),
    ).toThrowError(
      new BadRequestException(
        '판매자명은 5자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });

  it('name이 정상적인 입력인 경우 instance가 생성된다.', () => {
    expect(() => new Seller({ name: 'abcde' })).not.toThrow();
  });
});

describe('SellerDomain Method Test', () => {
  const sellerEntity = new SellerEntity();
  sellerEntity.id = 1;
  sellerEntity.name = 'test123';
  sellerEntity.ctime = new Date();
  sellerEntity.mtime = new Date();
  const client = Seller.createFromEntity(sellerEntity);

  it('get id()', () => {
    expect(client.id).toBe(1);
  });

  it('get name()', () => {
    expect(client.name).toBe('test123');
  });

  it('toEntity()', () => {
    expect(client.toEntity()).toEqual(sellerEntity);
  });
});
