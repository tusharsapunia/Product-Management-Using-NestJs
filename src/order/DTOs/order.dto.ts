import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderProductDTO } from './orderproduct.dto.js';
import { OrderEnum } from '../enum/orderstatus.enum.js';
import { Type } from 'class-transformer';
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

  @ApiProperty({ type: [OrderProductDTO], required: true })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDTO)
  products: OrderProductDTO[];

  @ApiProperty()
  @IsEnum(OrderEnum)
  status: OrderEnum;
}
