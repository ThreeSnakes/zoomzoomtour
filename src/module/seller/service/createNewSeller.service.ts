import { Injectable } from '@nestjs/common';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewSellerRequestDto } from '../dto/service/createNewSellerRequest.dto';
import { Seller } from '../domain/seller.domain';
import { CreateNewSellerResponseDto } from '../dto/service/createNewSellerResponse.dto';

@Injectable()
export class CreateNewSellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {
    this.sellerRepository = sellerRepository;
  }
  async execute({
    name,
  }: CreateNewSellerRequestDto): Promise<CreateNewSellerResponseDto> {
    const newSeller = new Seller({ name });
    const result = await this.sellerRepository.save(newSeller.toEntity());

    return {
      seller: Seller.createFromEntity(result),
    };
  }
}
