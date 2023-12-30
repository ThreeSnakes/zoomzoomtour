import { ClientEntity } from '../../infra/database/entity/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewClientDto } from './dto/service/createNewClient.dto';

export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {
    this.clientRepository = clientRepository;
  }

  async createNewClient(
    createNewClientDto: CreateNewClientDto,
  ): Promise<ClientEntity> {
    const newClient = new ClientEntity();
    newClient.name = createNewClientDto.name;
    return this.clientRepository.save(newClient);
  }
}
