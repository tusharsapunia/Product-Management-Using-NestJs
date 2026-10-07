import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsString } from 'class-validator';
import { OrderProductDTO } from './orderproduct.dto.js';
import { OrderEnum } from '../enum/orderstatus.enum.js';
export class OrderDTO {
  // @ApiProperty()
  // @IsInt()
  // id: number;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  mobile: bigint;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ type: [OrderProductDTO] })
  @IsArray()
  products: OrderProductDTO[];

  @ApiProperty()
  @IsEnum(OrderEnum)
  status: OrderEnum;
}
