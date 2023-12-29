import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Welcome API',
    description: 'root API',
  })
  @ApiResponse({
    status: 200,
    description: 'server state is normal',
  })
  getWelcome(): string {
    return this.appService.getWelcome();
  }

  @Get('/health')
  @ApiOperation({
    summary: 'WebServer Check APi',
    description: 'WebServer 동작 체크용 API',
  })
  @ApiResponse({
    status: 200,
    description: 'server state is normal',
  })
  health(): string {
    return this.appService.getOk();
  }
}
