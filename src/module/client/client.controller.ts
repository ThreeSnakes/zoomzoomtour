import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClient } from './dto/api/registerClientRequest.dto';
import { CreateNewClientService } from './service/createNewClient.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterClientResponseDto } from './dto/api/registerClientResponse.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('/v1/client')
export class ClientController {
  constructor(private readonly clientService: CreateNewClientService) {}

  @Post()
  @ApiOperation({
    summary: 'Client 등록 API',
    description: '신규 Client를 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: 'Client 등록 성공',
    type: RegisterClientResponseDto,
  })
  async registerClient(
    @Body() registerClient: RegisterClient,
  ): Promise<RegisterClientResponseDto> {
    const { client } = await this.clientService.execute({
      name: registerClient.name,
    });

    return {
      id: client.id,
      name: client.name,
    };
  }
}
