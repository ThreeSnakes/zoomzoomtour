import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourRequestDto } from './dto/api/createTourRequest.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTourResponseDto } from './dto/api/createTourResponse.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { GetTourReservationCalendarRequestDto } from './dto/api/getTourReservationCalendarRequestDto';
import { ModifyTourHolidaysRequestDto } from './dto/api/modifyTourHolidaysRequest.dto';
import { ModifyTourHolidaysResponseDto } from './dto/api/modifyTourHolidaysResponse.dto';

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

  @Get('/:tourId')
  @ApiOperation({
    summary: 'Tour 예약 가능 날자 조회 API',
    description: 'Client가 특정 Tour의 예약 가능 날짜를 조회할 때 사용한다.',
  })
  async getTourReservationCalendar(
    @Param('tourId') tourId: number,
    @Query()
    getTourReservationCalendarRequestDto: GetTourReservationCalendarRequestDto,
  ) {
    return this.tourService.fetchTourCalendar({
      tourId,
      year: getTourReservationCalendarRequestDto.year,
      month: getTourReservationCalendarRequestDto.month,
    });
  }

  @Put('/:tourId/holidays')
  @ApiOperation({
    summary: 'Tour 휴일 변경 API',
    description: 'Seller가 특정 Tour의 휴일을 변경할 때 사용한다.',
  })
  async modifyTourHolidays(
    @Param('tourId') tourId: number,
    @Body() modifyTourHolidaysRequestDto: ModifyTourHolidaysRequestDto,
  ): Promise<ModifyTourHolidaysResponseDto> {
    const { tour } = await this.tourService.modifyTourHolidays({
      tourId: tourId,
      regularHolidays: modifyTourHolidaysRequestDto.regularHoliday,
      holidays: modifyTourHolidaysRequestDto.holiday,
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
