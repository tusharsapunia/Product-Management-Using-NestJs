import { Module } from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { StaffController } from './staff.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from '../auth/entity/auth.entity.js';
import { RolesPermissionsEntity } from '../auth/entity/role.entity.js';
import { MailService } from '../mail/mail.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity, RolesPermissionsEntity])],
  providers: [StaffService ,MailService],
  controllers: [StaffController],
})
export class StaffModule {}
