import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { RegisterSellerDto } from './dto/api/registerSeller.dto';

@Controller('/v1/seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  @ApiOperation({
    summary: 'Seller 등록 API',
    description: '신규 Seller를 등록할 때 사용한다.',
  })
  async registerSeller(@Body() registerSellerDto: RegisterSellerDto) {
    return this.sellerService.createNewSeller({
      name: registerSellerDto.name,
    });
  }
}
