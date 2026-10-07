import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderEnum } from '../enum/orderstatus.enum.js';

export class StatusOrder {
  @ApiProperty({ example: 'CANCELLED' })
  @IsEnum(OrderEnum)
  status: OrderEnum;
}
