import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class StaffRegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  mobile: bigint;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsInt()
  role: number;

  @ApiProperty()
  @IsString()
  password: string;
}
