import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MakeNewReservationDto } from './dto/api/makeNewReservation.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApproveReservationDto } from './dto/api/approveReservation.dto';

@Controller('/v1/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: '예약  등록 API',
    description: '신규 투어 예약을 등록할 때 사용한다.',
  })
  async makeNewReservation(
    @Body() makeNewReservationDto: MakeNewReservationDto,
  ) {
    return this.reservationService.createNewReservation({
      clientId: makeNewReservationDto.clientId,
      tourId: makeNewReservationDto.tourId,
      date: makeNewReservationDto.date,
    });
  }

  @Put('/:token')
  @ApiOperation({
    summary: '예약 승인 API',
    description: '투어의 대기 상태의 고객을 추가로 승인할 때 사용한다.',
  })
  async approveReservation(
    @Param('token') token: string,
    @Body() approveReservationDto: ApproveReservationDto,
  ) {
    return this.reservationService.approveWaitReservation({
      sellerId: approveReservationDto.sellerId,
      token,
    });
  }
}
