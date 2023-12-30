import { Injectable } from '@nestjs/common';
import { TourEntity } from '../../infra/database/entity/tour.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewTourDto } from './dto/service/createNewTour.dto';
import { SellerEntity } from '../../infra/database/entity/seller.entity';
import { RegularHolidayEntity } from '../../infra/database/entity/regularHoliday.entity';
import { HolidayEntity } from '../../infra/database/entity/holiday.entity';

@Injectable()
export class TourService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TourEntity)
    private readonly tourRepository: Repository<TourEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
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
      const newTour = new TourEntity();
      newTour.name = dto.tourName;
      newTour.description = dto.tourDescription;
      newTour.seller = Promise.resolve(seller);
      const tourResult = await queryRunner.manager.save(newTour);

      const regularHolidayList =
        dto.tourRegularHoliday?.map((regularHoliday) => {
          const newRegularHoliday = new RegularHolidayEntity();
          newRegularHoliday.tour = Promise.resolve(tourResult);
          newRegularHoliday.day = regularHoliday;
          return newRegularHoliday;
        }) || [];
      await queryRunner.manager.save(regularHolidayList);

      const holidayList =
        dto.tourHoliday?.map((holiday) => {
          const newHoliday = new HolidayEntity();
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
