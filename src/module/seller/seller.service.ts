import { Injectable } from '@nestjs/common';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewSellerDto } from './dto/service/createNewSeller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {
    this.sellerRepository = sellerRepository;
  }
  async createNewSeller(dto: CreateNewSellerDto): Promise<SellerEntity> {
    const newSeller = new SellerEntity();
    newSeller.name = dto.name;
    return this.sellerRepository.save(newSeller);
  }
}
