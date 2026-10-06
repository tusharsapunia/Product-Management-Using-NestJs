import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
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
  @IsString()
  status: string;
}
