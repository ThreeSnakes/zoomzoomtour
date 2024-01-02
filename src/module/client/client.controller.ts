import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClient } from './dto/api/registerClientRequest.dto';
import { CreateNewClientService } from './service/createNewClient.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterClientResponseDto } from './dto/api/registerClientResponse.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('/v1/client')
export class ClientController {
  constructor(
    private readonly createNewClientService: CreateNewClientService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '고객 등록 API',
    description: '신규 고객을 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: '고객 등록 성공',
    type: RegisterClientResponseDto,
  })
  async registerClient(
    @Body() registerClient: RegisterClient,
  ): Promise<RegisterClientResponseDto> {
    const { client } = await this.createNewClientService.execute({
      name: registerClient.name,
    });

    return {
      id: client.id,
      name: client.name,
    };
  }
}
