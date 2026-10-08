import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
// import { ProductEnum } from '../enum/product.enum.js';
import { Type } from 'class-transformer';
export class ProductDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  stock: number;

  @ApiProperty()
  @IsString()
  category: string;

  // @ApiProperty()
  // @IsEnum(ProductEnum)
  // status: ProductEnum;
}
