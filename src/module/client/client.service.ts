import { Client } from '../../infra/database/entity/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewClientDto } from './dto/service/createNewClient.dto';

export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {
    this.clientRepository = clientRepository;
  }

  async createNewClient(
    createNewClientDto: CreateNewClientDto,
  ): Promise<Client> {
    const newClient = new Client();
    newClient.name = createNewClientDto.name;
    return this.clientRepository.save(newClient);
  }
}
