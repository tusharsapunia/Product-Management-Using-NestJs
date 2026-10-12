import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthuserDTO } from './dtos/authuser.dto.js';
import { AuthLoginDTO } from './dtos/authLogin.dto.js';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: AuthuserDTO) {
    return this.AuthService.signup(body);
  }

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.AuthService.login(body);
  }
}
