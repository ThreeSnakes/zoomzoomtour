import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { Seller } from '../../database/entity/seller.entity';

@Module({
  controllers: [SellerController],
  imports: [TypeOrmModule.forFeature([Seller])],
  providers: [SellerService],
})
export class SellerModule {}
