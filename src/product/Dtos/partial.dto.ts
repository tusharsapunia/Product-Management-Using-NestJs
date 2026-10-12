import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { Type } from 'class-transformer';

export class PartialProduct {
  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  stock?: number;

  @ApiPropertyOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File;
}
