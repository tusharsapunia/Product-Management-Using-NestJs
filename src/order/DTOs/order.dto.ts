import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';
import { OrderProductDTO } from './orderproduct.dto.js';
import { Transform } from 'class-transformer';
export class OrderDTO {
  // @ApiProperty()
  // @IsInt()
  // id: number;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsInt()
  mobile: number;
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ type: [OrderProductDTO] })
  @IsArray()
  products: OrderProductDTO[];

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsString()
  status: string;
}
