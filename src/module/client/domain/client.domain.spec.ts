import { Client } from './client.domain';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { ClientEntity } from '../../../infra/database/entity/client.entity';

describe('ClientDomain 생성 Test', () => {
  it('name이 5글자 이하인 경우 Error를 리턴한다.', () => {
    expect(() => new Client({ name: 'test' })).toThrowError(
      new BadRequestException(
        '고객명은 5글자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });

  it('name이 100글자 이상인 경우 Error를 리턴한다.', () => {
    expect(
      () =>
        new Client({
          name: 'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde',
        }),
    ).toThrowError(
      new BadRequestException(
        '고객명은 5글자 이상, 100자 이하로 입력되어야 합니다.',
      ),
    );
  });

  it('name이 정상적인 입력인 경우 instance가 생성된다.', () => {
    expect(() => new Client({ name: 'abcde' })).not.toThrow();
  });
});

describe('ClientDomain Method Test', () => {
  const clientEntity = new ClientEntity();
  clientEntity.id = 1;
  clientEntity.name = 'test123';
  clientEntity.ctime = new Date();
  clientEntity.mtime = new Date();
  const client = Client.createFromEntity(clientEntity);

  it('get id()', () => {
    expect(client.id).toBe(1);
  });

  it('get name()', () => {
    expect(client.name).toBe('test123');
  });

  it('toEntity()', () => {
    expect(client.toEntity()).toEqual(clientEntity);
  });
});
