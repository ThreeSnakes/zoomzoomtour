import { CreateNewClientRequestDto } from '../dto/service/createNewClientRequest.dto';
import { Client } from '../domain/client.domain';
import { createNewClientResponseDto } from '../dto/service/createNewClientResponse.dto';
import { ClientRepository } from '../repository/client.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateNewClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute({
    name,
  }: CreateNewClientRequestDto): Promise<createNewClientResponseDto> {
    const client = await this.clientRepository.createClient(
      new Client({ name }),
    );

    return {
      client,
    };
  }
}
