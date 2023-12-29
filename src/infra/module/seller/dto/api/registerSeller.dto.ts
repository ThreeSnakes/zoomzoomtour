import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterSellerDto {
  @ApiProperty({
    description: 'username',
    minLength: 5,
    maxLength: 20,
  })
  @MinLength(5)
  @MaxLength(20)
  @IsString()
  name: string;
}
