import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterSellerRequestDto {
  @ApiProperty({
    description: 'Seller name',
    minLength: 1,
    maxLength: 100,
  })
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  name: string;
}
