import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CancelReservationService } from './service/cancelReservation.service';
import { MakeNewReservationRequestDto } from './dto/api/makeNewReservationRequest.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApproveReservationRequestDto } from './dto/api/approveReservationRequest.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { MakeNewReservationResponseDto } from './dto/api/makeNewReservationResponse.dto';
import { ApproveReservationResponseDto } from './dto/api/approveReservationResponse.dto';
import { CancelReservationRequestDto } from './dto/api/cancelReservationRequest.dto';
import { CancelReservationResponseDto } from './dto/api/cancelReservationResponse.dto';
import { CreateNewReservationService } from './service/createNewReservation.service';
import { ApproveWaitReservationService } from './service/approveWaitReservation.service';

@Controller('/v1/reservation')
export class ReservationController {
  constructor(
    private readonly cancelReservationService: CancelReservationService,
    private readonly createNewReservationService: CreateNewReservationService,
    private readonly approveWaitReservationService: ApproveWaitReservationService,
  ) {}

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
    const { reservation } = await this.createNewReservationService.execute({
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

  @Put('/:token/approve')
  @ApiOperation({
    summary: '예약 승인 API',
    description: '판매자가 투어 대기 상태의 고객을 추가로 승인할 때 사용한다.',
  })
  @ApiOkResponse({
    description: '예약 승인 성공',
    type: ApproveReservationResponseDto,
  })
  async approveReservation(
    @Param('token') token: string,
    @Body() approveReservationDto: ApproveReservationRequestDto,
  ): Promise<ApproveReservationResponseDto> {
    const { reservation } = await this.approveWaitReservationService.execute({
      sellerId: approveReservationDto.sellerId,
      token,
    });

    return {
      tourId: (await reservation.tour()).id,
      token: reservation.token,
      state: reservation.state,
    };
  }

  @Put('/:token/cancel')
  @ApiOperation({
    summary: '예약 취소 API',
    description: '고객이 승인이 완료된 투어를 취소할 때 사용한다.',
  })
  @ApiOkResponse({
    description: '예약 취소 성공',
    type: CancelReservationResponseDto,
  })
  async cancelReservation(
    @Param('token') token: string,
    @Body() cancelReservationRequestDto: CancelReservationRequestDto,
  ): Promise<CancelReservationResponseDto> {
    const { reservation } = await this.cancelReservationService.execute({
      token,
      clientId: cancelReservationRequestDto.clientId,
    });

    return {
      tourId: (await reservation.tour()).id,
      token: reservation.token,
      state: reservation.state,
    };
  }
}
