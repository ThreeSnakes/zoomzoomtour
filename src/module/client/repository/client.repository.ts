import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { Client } from '../domain/client.domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {
    this.clientRepository = clientRepository;
  }

  async createClient(client: Client): Promise<Client> {
    const result = await this.clientRepository.save(client.toEntity());

    return Client.createFromEntity(result);
  }
}
