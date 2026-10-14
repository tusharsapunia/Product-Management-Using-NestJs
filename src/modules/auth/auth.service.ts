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
@Injectable()
export class AuthService {
  constructor(
    private JwtSerivce: JwtService,
    @InjectRepository(AuthEntity) private AuthRepo: Repository<AuthEntity>,
  ) {}

  async signup(data: AuthuserDTO, role: string) {
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
      role: role,
    });

    return this.AuthRepo.save(userInfo);
  }

  async login(data: AuthLoginDTO) {
    const email = data.email;
    const password = data.password;
    const user = await this.AuthRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not Found Please Signup');
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
    };

    return {
      access_Token: this.JwtSerivce.sign(payload, { expiresIn: '10m' }),
    };
  }
}
