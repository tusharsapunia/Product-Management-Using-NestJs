import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from '../auth/entity/auth.entity.js';
import { Repository } from 'typeorm';
import { StaffRegisterDto } from './dtos/staffregister.dto.js';
import { RolesPermissionsEntity } from '../auth/entity/role.entity.js';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(AuthEntity) private AuthRepo: Repository<AuthEntity>,
    @InjectRepository(RolesPermissionsEntity)
    private RolePerRepo: Repository<RolesPermissionsEntity>,
    private readonly MailService: MailService,
  ) {}

  async createStaff(data: StaffRegisterDto) {
    const role = data.role;
    const roles = await this.RolePerRepo.findOne({
      where: { id: role },
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
    const save = await this.AuthRepo.save(userInfo);
    await this.MailService.sendOtpAndPass(data.email, data.password);

    return {
      message: 'staff created successfully.',
      data: this.AuthRepo.findOne({
        where: { id: save.id },
        relations: { role: true },
      }),
    };
  }

  async deleteStaff(id: number) {
    const data = await this.AuthRepo.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!data) {
      throw new NotFoundException('Staff not found');
    }
    await this.AuthRepo.delete(id);
    return {
      message: 'Data Delete Successfully',
      data: data,
    };
  }
}
