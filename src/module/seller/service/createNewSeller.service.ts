import { Injectable } from '@nestjs/common';
import { SellerEntity } from '../../../infra/database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewSellerRequestDto } from '../dto/service/createNewSellerRequest.dto';
import { Seller } from '../domain/seller.domain';
import { CreateNewSellerResponseDto } from '../dto/service/createNewSellerResponse.dto';
import { SellerRepository } from '../repository/seller.repository';

@Injectable()
export class CreateNewSellerService {
  constructor(private readonly sellerRepository: SellerRepository) {}
  async execute({
    name,
  }: CreateNewSellerRequestDto): Promise<CreateNewSellerResponseDto> {
    const seller = await this.sellerRepository.createSeller(
      new Seller({ name }),
    );

    return {
      seller,
    };
  }
}
