import { Body, Controller, Post } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourRequestDto } from './dto/api/createTourRequest.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTourResponseDto } from './dto/api/createTourResponse.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('/v1/tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiOperation({
    summary: 'Tour 등록 API',
    description: 'Seller가 신규 Tour를 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: 'Tour 등록 성공',
    type: CreateTourResponseDto,
  })
  async createTour(
    @Body() createTourDto: CreateTourRequestDto,
  ): Promise<CreateTourResponseDto> {
    const { tour } = await this.tourService.createNewTour({
      sellerId: createTourDto.sellerId,
      tourName: createTourDto.name,
      tourDescription: createTourDto.description,
      tourRegularHoliday: createTourDto.regularHoliday,
      tourHoliday: createTourDto.holiday,
    });

    return {
      id: tour.id,
      name: tour.name,
      description: tour.description,
      regularHolidays:
        (await tour.regularHolidays())?.map(
          (regularHoliday) => regularHoliday.day,
        ) || [],
      holidays: (await tour.holidays())?.map((holiday) => holiday.date) || [],
    };
  }
}
