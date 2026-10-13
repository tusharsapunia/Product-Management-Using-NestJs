import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStratagy extends PassportStrategy(Strategy) {
  constructor(ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.getOrThrow<string>('SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userID,
      name: payload.name,
      email: payload.email,
      mobile: payload.mobileNumber,
    };
  }
}
