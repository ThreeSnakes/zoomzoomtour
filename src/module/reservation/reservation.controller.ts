import { Body, Controller, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MakeNewReservationDto } from './dto/api/makeNewReservation.dto';
import { ApiOperation } from '@nestjs/swagger';

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
    });
  }
}
