import { Injectable } from '@nestjs/common';
import { Tour } from '../../infra/database/entity/tour.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewTourDto } from './dto/service/createNewTour.dto';
import { Seller } from '../../infra/database/entity/seller.entity';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {
    this.tourRepository = tourRepository;
  }

  async createNewTour(dto: CreateNewTourDto): Promise<Tour> {
    const seller = await this.sellerRepository.findOneBy({
      id: dto.clientId,
    });

    if (!seller) {
      throw new Error(`seller(${dto.clientId}) is not exist.`);
    }

    const newTour = new Tour();
    newTour.name = dto.tourName;
    newTour.description = dto.tourDescription;
    newTour.seller = Promise.resolve(seller);

    return this.tourRepository.save(newTour);
  }
}
