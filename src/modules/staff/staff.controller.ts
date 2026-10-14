import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { StaffRegisterDto } from './dtos/staffregister.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../core/guards/permission/permission.guard.js';
import { Permissions } from '../../core/decorators/permission.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('staff:create')
  @Post()
  async createStaff(@Body() data: StaffRegisterDto) {
    return this.staffService.createStaff(data);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('staff:delete')
  @Delete(':id')
  async deleteStaff(@Param('id') id: number) {
    return this.staffService.deleteStaff(id);
  }
}
