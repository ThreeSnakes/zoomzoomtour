import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTourDto {
  @ApiProperty({
    description: 'clientId',
  })
  @Min(1)
  @IsNumber()
  client_id: number;

  @ApiProperty({
    description: 'tour name',
    minLength: 0,
    maxLength: 100,
  })
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'tour description',
    minLength: 0,
    maxLength: 200,
  })
  @MinLength(1)
  @MaxLength(200)
  @IsString()
  description: string;
}
