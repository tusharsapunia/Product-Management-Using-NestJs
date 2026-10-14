import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entity/auth.entity.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStratagy } from './jwt.stratagy.js';
import { MailModule } from '../mail/mail.module.js';
import { MailService } from '../mail/mail.service.js';
import { RolesPermissionsEntity } from './entity/role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, RolesPermissionsEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET'),
        signOptions: { expiresIn: '20m' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
  providers: [AuthService, JwtStratagy, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
