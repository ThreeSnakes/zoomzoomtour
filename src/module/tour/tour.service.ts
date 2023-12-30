import { Injectable } from '@nestjs/common';
import { Tour } from '../../infra/database/entity/tour.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewTourDto } from './dto/service/createNewTour.dto';
import { Seller } from '../../infra/database/entity/seller.entity';
import { RegularHoliday } from '../../infra/database/entity/regularHoliday.entity';
import { Holiday } from '../../infra/database/entity/holiday.entity';

@Injectable()
export class TourService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {
    this.tourRepository = tourRepository;
  }

  async createNewTour(dto: CreateNewTourDto): Promise<void> {
    const seller = await this.sellerRepository.findOneBy({
      id: dto.clientId,
    });

    if (!seller) {
      throw new Error(`seller(${dto.clientId}) is not exist.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTour = new Tour();
      newTour.name = dto.tourName;
      newTour.description = dto.tourDescription;
      newTour.seller = Promise.resolve(seller);
      const tourResult = await queryRunner.manager.save(newTour);

      const regularHolidayList =
        dto.tourRegularHoliday?.map((regularHoliday) => {
          const newRegularHoliday = new RegularHoliday();
          newRegularHoliday.tour = Promise.resolve(tourResult);
          newRegularHoliday.day = regularHoliday;
          return newRegularHoliday;
        }) || [];
      await queryRunner.manager.save(regularHolidayList);

      const holidayList =
        dto.tourHoliday?.map((holiday) => {
          const newHoliday = new Holiday();
          newHoliday.tour = Promise.resolve(tourResult);
          newHoliday.date = holiday;
          return newHoliday;
        }) || [];
      await queryRunner.manager.save(holidayList);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
