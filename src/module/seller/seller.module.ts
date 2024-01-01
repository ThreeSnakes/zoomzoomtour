import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { CreateNewSellerService } from './service/createNewSeller.service';
import { SellerEntity } from '../../infra/database/entity/seller.entity';

@Module({
  controllers: [SellerController],
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  providers: [CreateNewSellerService],
})
export class SellerModule {}
