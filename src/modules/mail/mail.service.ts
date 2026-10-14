import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private ConfigService: ConfigService) {
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

  async sendEmail( to: string , subject: string , text: string ) {
    try {
      const result = await this.transporter.sendMail({
        from: this.ConfigService.get<string>('SMTP_USER'),
        to:to,
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
}
