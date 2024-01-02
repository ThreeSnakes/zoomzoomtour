import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { Repository } from 'typeorm';
import { Seller } from '../domain/seller.domain';

export class SellerRepository {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {}

  async createSeller(seller: Seller): Promise<Seller> {
    const result = await this.sellerRepository.save(seller.toEntity());

    return Seller.createFromEntity(result);
  }
}
