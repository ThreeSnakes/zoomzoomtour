import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { RegisterSellerRequestDto } from './dto/api/registerSellerRequest.dto';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('/v1/seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  @ApiOperation({
    summary: 'Seller 등록 API',
    description: '신규 Seller를 등록할 때 사용한다.',
  })
  @ApiCreatedResponse({
    description: 'Tour 등록 성공',
    type: RegisterSellerRequestDto,
  })
  async registerSeller(@Body() registerSellerDto: RegisterSellerRequestDto) {
    const { seller } = await this.sellerService.createNewSeller({
      name: registerSellerDto.name,
    });

    return {
      id: seller.id,
      name: seller.name,
    };
  }
}
