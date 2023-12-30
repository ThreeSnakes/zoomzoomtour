import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../infra/database/entity/client.entity';

@Module({
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService],
})
export class ClientModule {}
