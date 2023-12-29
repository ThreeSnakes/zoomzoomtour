import { Injectable } from '@nestjs/common';
import { Seller } from '../../database/entity/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewSellerDto } from './dto/service/createNewSeller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {
    this.sellerRepository = sellerRepository;
  }
  async createNewSeller(dto: CreateNewSellerDto): Promise<Seller> {
    const newSeller = new Seller();
    newSeller.name = dto.name;
    return this.sellerRepository.save(newSeller);
  }
}
