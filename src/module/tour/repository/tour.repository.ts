import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from '../domain/tour.domain';
import { TourEntity } from '../../../infra/database/entity/tour.entity';

export class TourRepository {
  constructor(
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
  ) {}

  async getTourById(tourId: number): Promise<Tour> {
    const result = await this.tourRepository.findOneOrFail({
      where: {
        id: tourId,
      },
    });

    return Tour.createFromEntity(result);
  }
}
