import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsInt()
  otp: number;
}
