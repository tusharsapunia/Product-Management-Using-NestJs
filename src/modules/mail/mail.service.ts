import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from '../auth/entity/auth.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(AuthEntity) private Authrepo: Repository<AuthEntity>,
    private ConfigService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.ConfigService.get<string>('EMAIL_HOST'),
      port: this.ConfigService.get<number>('PORTS'),
      secure: false,
      auth: {
        user: this.ConfigService.get<string>('EMAIL_USER'),
        pass: this.ConfigService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const result = await this.transporter.sendMail({
        from: this.ConfigService.get<string>('SMTP_USER'),
        to: to,
        subject: subject,
        text: text,
      });

      return {
        message: 'Email sent successfully',
        messageId: result.messageId,
      };
    } catch {
      throw new InternalServerErrorException('Email sending failed');
    }
  }
  async sendOtp(email: string) {
    let otp = crypto.randomInt(100000, 1000000);
    let hashOpt = await bcrypt.hash(String(otp), 10);
    let expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    const existingUser = await this.Authrepo.findOne({
      where: { email: email },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found for this email');
    }
    const id = existingUser.id;
    if (existingUser.isEmailVerified) {
      throw new ConflictException('User Already verified');
    }
    await this.Authrepo.update(id, {
      hashOtp: hashOpt,
      expiredAt: expiredAt,
    });

    try {
      const result = await this.transporter.sendMail({
        from: this.ConfigService.get<string>('SMTP_USER'),
        to: email,
        subject: `User Email Verification`,
        text: `Verify  your email Using this Otp :- ${otp}`,
      });

      return {
        message: 'Email Send successfully',
        messageId: result.messageId,
      };
    } catch {
      throw new InternalServerErrorException('Email Sending failed');
    }
  }
}
