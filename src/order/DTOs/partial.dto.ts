import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class partialOrder {
  @IsOptional()
  @IsString()
  customername: string;

  @IsOptional()
  @IsInt()
  MonilNumber: number;
  @IsOptional()
  @IsString()
  Address: string;
  @IsOptional()
  @IsString()
  status: string;
}
