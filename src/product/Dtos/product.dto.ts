import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { ProductEnum } from '../enum/product.enum.js';
export class ProductDTO {
  @ApiProperty()
  @IsString()
  name: string;

  // @ApiProperty()
  // @IsString()
  // description: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsInt()
  stock: number;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsEnum(ProductEnum)
  status: ProductEnum;
}
