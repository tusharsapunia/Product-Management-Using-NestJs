import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dtos/create-category.dto.js';
import { UpdateCategoryDto } from './dtos/update-category.dto.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../core/guards/permission/permission.guard.js';
import { Permissions } from '../../core/decorators/permission.decorator.js';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('category:create')
  @Post()
  async create(@Body() data: CreateCategoryDto) {
    return this.CategoryService.createCat(data);
  }

  @Get()
  async getAll() {
    return this.CategoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.CategoryService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('category:update')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateCategoryDto) {
    return this.CategoryService.updateCat(id, data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('category:delete')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.CategoryService.deleteCat(id);
  }
}
