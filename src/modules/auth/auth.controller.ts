import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthuserDTO } from './dtos/authuser.dto.js';
import { AuthLoginDTO } from './dtos/authLogin.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('store/Register')
  async storeSignup(@Body() body: AuthuserDTO) {
    const role = 'store';
    return this.AuthService.signup(body, role);
  }
  @Post('customer/Register')
  async customerSignup(@Body() body: AuthuserDTO) {
    const role = 'customer';
    return this.AuthService.signup(body, role);
  }

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.AuthService.login(body);
  }
}
