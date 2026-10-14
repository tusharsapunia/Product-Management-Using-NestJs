import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entity/auth.entity.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStratagy } from './jwt.stratagy.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStratagy],
  controllers: [AuthController],
})
export class AuthModule {}
