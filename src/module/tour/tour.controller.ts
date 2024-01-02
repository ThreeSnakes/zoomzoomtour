import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TourService } from './service/tour.service';
import { CreateTourRequestDto } from './dto/api/createTourRequest.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTourResponseDto } from './dto/api/createTourResponse.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { GetTourReservationCalendarRequestDto } from './dto/api/getTourReservationCalendarRequestDto';
import { ModifyTourHolidaysRequestDto } from './dto/api/modifyTourHolidaysRequest.dto';
import { ModifyTourHolidaysResponseDto } from './dto/api/modifyTourHolidaysResponse.dto';
import { CreateNewTourService } from './service/createNewTour.service';
import { ModifyTourHolidaysService } from './service/modifyTourHolidays.service';
import { GetTourReservationCalendarResponseDto } from './dto/api/getTourReservationCalendarResponse.dto';

@Controller('/v1/tour')
export class TourController {
  constructor(
    private readonly tourService: TourService,
    private readonly createNewTourService: CreateNewTourService,
    private readonly modifyTourHolidaysService: ModifyTourHolidaysService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '투어 등록 API',
    description: '판매자가 신규 투어를 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: '투어 등록 성공',
    type: CreateTourResponseDto,
  })
  async createTour(
    @Body() createTourDto: CreateTourRequestDto,
  ): Promise<CreateTourResponseDto> {
    const { tourInfo } = await this.createNewTourService.execute({
      sellerId: createTourDto.sellerId,
      tourName: createTourDto.name,
      tourDescription: createTourDto.description,
      tourRegularHoliday: createTourDto.regularHoliday,
      tourHoliday: createTourDto.holiday,
    });

    return {
      id: tourInfo.id,
      name: tourInfo.name,
      description: tourInfo.description,
      regularHolidays:
        tourInfo.regularHolidays?.map((regularHoliday) => regularHoliday.day) ||
        [],
      holidays: tourInfo.holidays?.map((holiday) => holiday.date) || [],
    };
  }

  @Get('/:tourId/reservation')
  @ApiOperation({
    summary: '투어 예약 가능 날자 조회 API',
    description: '고객이 특정 투어의 예약 가능 날짜를 조회할 때 사용한다.',
  })
  @ApiResponse({
    description: '투어 예약 가능 날짜 조회 성공',
    type: GetTourReservationCalendarResponseDto,
  })
  async getTourReservationCalendar(
    @Param('tourId') tourId: number,
    @Query()
    getTourReservationCalendarRequestDto: GetTourReservationCalendarRequestDto,
  ): Promise<GetTourReservationCalendarResponseDto> {
    const { tourInfo, tourCalendar } = await this.tourService.fetchTourCalendar(
      {
        tourId,
        year: getTourReservationCalendarRequestDto.year,
        month: getTourReservationCalendarRequestDto.month,
      },
    );

    return {
      id: tourInfo.id,
      name: tourInfo.name,
      description: tourInfo.description,
      regularHolidays:
        tourInfo.regularHolidays?.map((regularHoliday) =>
          regularHoliday.getDateByReadable(),
        ) || [],
      holidays: tourInfo.holidays?.map((holiday) => holiday.date) || [],
      calendar: tourCalendar,
    };
  }

  @Put('/:tourId/holidays')
  @ApiOperation({
    summary: '투어 휴일 변경 API',
    description: '판매자가 특정 투어의 휴일을 변경할 때 사용한다.',
  })
  @ApiResponse({
    description: '투어 휴일 변경 성공',
    type: ModifyTourHolidaysResponseDto,
  })
  async modifyTourHolidays(
    @Param('tourId') tourId: number,
    @Body() modifyTourHolidaysRequestDto: ModifyTourHolidaysRequestDto,
  ): Promise<ModifyTourHolidaysResponseDto> {
    const { tourInfo } = await this.modifyTourHolidaysService.execute({
      tourId: tourId,
      regularHolidays: modifyTourHolidaysRequestDto.regularHoliday,
      holidays: modifyTourHolidaysRequestDto.holiday,
    });

    return {
      id: tourInfo.id,
      name: tourInfo.name,
      description: tourInfo.description,
      regularHolidays:
        tourInfo.regularHolidays?.map((regularHoliday) =>
          regularHoliday.getDateByReadable(),
        ) || [],
      holidays: tourInfo.holidays?.map((holiday) => holiday.date) || [],
    };
  }
}
