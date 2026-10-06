import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class OrderProductDTO {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
