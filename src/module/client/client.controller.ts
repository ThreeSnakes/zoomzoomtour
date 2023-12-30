import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClient } from './dto/api/registerClient.dto';
import { ClientService } from './client.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/v1/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({
    summary: 'Client 등록 API',
    description: '신규 Client를 등록할 때 사용한다.',
  })
  async registerClient(@Body() registerClient: RegisterClient) {
    return this.clientService.createNewClient({
      name: registerClient.name,
    });
  }
}
