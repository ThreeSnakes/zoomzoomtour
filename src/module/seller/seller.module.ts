import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerEntity } from '../../infra/database/entity/seller.entity';

@Module({
  controllers: [SellerController],
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  providers: [SellerService],
})
export class SellerModule {}
