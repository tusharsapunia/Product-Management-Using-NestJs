import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AuthuserDTO {
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
  @IsString()
  password: string;
}
