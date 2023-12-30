import { Body, Controller, Post } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/api/CreateTour.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/v1/tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiOperation({
    summary: 'Tour 등록 API',
    description: 'Seller가 신규 Tour를 등록할 때 사용한다.',
  })
  async createTour(@Body() createTourDto: CreateTourDto) {
    return this.tourService.createNewTour({
      clientId: createTourDto.client_id,
      tourName: createTourDto.name,
      tourDescription: createTourDto.description,
      tourRegularHoliday: createTourDto.regularHoliday,
      tourHoliday: createTourDto.holiday,
    });
  }
}
