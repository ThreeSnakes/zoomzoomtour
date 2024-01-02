import { Repository } from 'typeorm';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '../../seller/domain/seller.domain';

export class SellerRepository {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {}

  async getSellerById(sellerId: number): Promise<Seller> {
    const result = await this.sellerRepository.findOneByOrFail({
      id: sellerId,
    });

    return Seller.createFromEntity(result);
  }
}
