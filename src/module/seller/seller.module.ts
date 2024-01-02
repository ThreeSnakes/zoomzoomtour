import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { CreateNewSellerService } from './service/createNewSeller.service';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { SellerRepository } from './repository/seller.repository';

@Module({
  controllers: [SellerController],
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  providers: [CreateNewSellerService, SellerRepository],
})
export class SellerModule {}
