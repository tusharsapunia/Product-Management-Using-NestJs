import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service.js';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendmail(@Body() body: { to: string; subject: string; text: string }) {
    return this.mailService.sendEmail(body.to, body.subject, body.text);
  }
}
