import {IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class partialOrder {
  @ApiProperty()
  @IsOptional()
  @IsString()
  customername: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  MobileNumber: bigint;

  @ApiProperty()
  @IsOptional()
  @IsString()
  Address: string;
}
