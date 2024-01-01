import { Injectable } from '@nestjs/common';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewSellerRequestDto } from './dto/service/createNewSellerRequest.dto';
import { Seller } from './seller.domain';
import { CreateNewSellerResponseDto } from './dto/service/createNewSellerResponse.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {
    this.sellerRepository = sellerRepository;
  }
  async createNewSeller({
    name,
  }: CreateNewSellerRequestDto): Promise<CreateNewSellerResponseDto> {
    const newSeller = new Seller({ name });
    const result = await this.sellerRepository.save(newSeller.toEntity());

    return {
      seller: Seller.createFromEntity(result),
    };
  }
}
