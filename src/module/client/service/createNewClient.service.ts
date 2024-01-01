import { ClientEntity } from '../../../infra/database/entity/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewClientRequestDto } from '../dto/service/createNewClientRequest.dto';
import { Client } from '../domain/client.domain';
import { createNewClientResponseDto } from '../dto/service/createNewClientResponse.dto';

export class CreateNewClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {
    this.clientRepository = clientRepository;
  }

  async execute({
    name,
  }: CreateNewClientRequestDto): Promise<createNewClientResponseDto> {
    const clientDomain = new Client({ name });
    const result = await this.clientRepository.save(clientDomain.toEntity());

    return {
      client: Client.createFromEntity(result),
    };
  }
}
