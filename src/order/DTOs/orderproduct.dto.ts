import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class OrderProductDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({ required: true })
  @IsInt()
  quantity: number;
}
