import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MakeNewReservationRequestDto } from './dto/api/makeNewReservationRequest.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApproveReservationRequestDto } from './dto/api/approveReservationRequest.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { MakeNewReservationResponseDto } from './dto/api/makeNewReservationResponse.dto';
import { ApproveReservationResponseDto } from './dto/api/approveReservationResponse.dto';

@Controller('/v1/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: '예약  등록 API',
    description: '신규 투어 예약을 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: '예약 등록 성공',
    type: MakeNewReservationResponseDto,
  })
  async makeNewReservation(
    @Body() makeNewReservationDto: MakeNewReservationRequestDto,
  ): Promise<MakeNewReservationResponseDto> {
    const { reservation } = await this.reservationService.createNewReservation({
      clientId: makeNewReservationDto.clientId,
      tourId: makeNewReservationDto.tourId,
      date: makeNewReservationDto.date,
    });

    return {
      tourId: (await reservation.tour()).id,
      token: reservation.token,
      state: reservation.state,
    };
  }

  @Put('/:token')
  @ApiOperation({
    summary: '예약 승인 API',
    description: '투어 대기 상태의 고객을 추가로 승인할 때 사용한다.',
  })
  async approveReservation(
    @Param('token') token: string,
    @Body() approveReservationDto: ApproveReservationRequestDto,
  ): Promise<ApproveReservationResponseDto> {
    const { reservation } =
      await this.reservationService.approveWaitReservation({
        sellerId: approveReservationDto.sellerId,
        token,
      });

    return {
      tourId: (await reservation.tour()).id,
      token: reservation.token,
      state: reservation.state,
    };
  }
}
