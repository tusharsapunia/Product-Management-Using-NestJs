import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { storeOrderStatusEnum } from '../../../shared/enum/storeOrderStatus.enum.js';

export class StoreOrderStatusDTO {
  @ApiProperty({ example: 'CANCELLED' })
  @IsEnum(storeOrderStatusEnum)
  status: storeOrderStatusEnum;
}