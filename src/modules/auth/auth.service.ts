import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthEntity } from './entity/auth.entity.js';
import { AuthuserDTO } from './dtos/authuser.dto.js';
import { AuthLoginDTO } from './dtos/authLogin.dto.js';
import { MailService } from '../mail/mail.service.js';
import { VerifyEmailDto } from './dtos/verifyEmail.dto.js';
import { GetOtpDto } from './dtos/getOtp.dto.js';
import { RolesPermissionsEntity } from './entity/role.entity.js';
@Injectable()
export class AuthService {
  constructor(
    private JwtSerivce: JwtService,
    @InjectRepository(AuthEntity) private AuthRepo: Repository<AuthEntity>,
    @InjectRepository(RolesPermissionsEntity)
    private RolePerRepo: Repository<RolesPermissionsEntity>,
    private readonly MailService: MailService,
  ) {}

  async signup(data: AuthuserDTO, role: string) {
    const roles = await this.RolePerRepo.findOne({
      where: { role_name: role },
    });
    if (!roles) {
      throw new ConflictException('No role Found ');
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const existingUser = await this.AuthRepo.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('user already registered');
    }

    const userInfo = this.AuthRepo.create({
      name: data.name,
      mobileNumber: data.mobile,
      email: data.email,
      password: hashPassword,
      role: { id: roles.id },
    });
    await this.MailService.sendOtp(data.email);

    return this.AuthRepo.save(userInfo);
  }

  async GetOtp(data: GetOtpDto) {
    const email = data.email;
    const existingUser = await this.AuthRepo.findOneBy({ email: email });
    if (!existingUser) {
      throw new NotFoundException('User Not Found Please Signup');
    }
    if (existingUser?.isEmailVerified) {
      throw new ConflictException('Email already verified');
    }
    const msg = await this.MailService.sendOtp(email);
    return {
      Message: `OTP sent Successfully at ${email} `,
      messageId: msg.messageId,
    };
  }
  async isVerified(data: VerifyEmailDto) {
    const { email, otp } = data;
    const existingUser = await this.AuthRepo.findOneBy({ email: email });
    if (!existingUser) {
      throw new NotFoundException('User Not Found Please Signup');
    }
    if (existingUser?.isEmailVerified) {
      throw new ConflictException('Email already verified');
    }

    if (existingUser.expiredAt) {
      if (new Date(existingUser.expiredAt) < new Date()) {
        return 'OTP expire';
      }
    }
    const isMatch = await bcrypt.compare(
      String(otp),
      existingUser.hashOtp as string,
    );
    if (!isMatch) {
      throw new NotFoundException('Incorrect OTP!!');
    }

    await this.AuthRepo.update(existingUser.id, {
      hashOtp: null,
      expiredAt: null,
      isEmailVerified: true,
    });

    const payload = {
      name: existingUser.name,
      userID: existingUser.id,
      email: existingUser.email,
      mobileNumber: existingUser.mobileNumber,
      role: existingUser.role,
      isVerified: true,
    };

    return {
      id: Date.now(),
      userName: payload.name,
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified,
      access_Token: this.JwtSerivce.sign(payload, { expiresIn: '20m' }),
      message: `Access Token Expire at ${new Date(Date.now() + 20 * 60 * 1000)}`,
    };
  }

  async login(data: AuthLoginDTO) {
    const email = data.email;
    const password = data.password;

    const user = await this.AuthRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not Found Please Signup');
    }
    if (!user.isEmailVerified) {
      throw new ConflictException('Please verify your email first');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Incorrect Password!!');
    }
    const payload = {
      name: user.name,
      userID: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      isVerified: user.isEmailVerified,
    };

    return {
      id: Date.now(),
      userName: payload.name,
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified,
      access_Token: this.JwtSerivce.sign(payload, { expiresIn: '20m' }),
      message: `Access Token Expire at ${new Date(Date.now() + 20 * 60 * 1000)}`,
    };
  }
}
