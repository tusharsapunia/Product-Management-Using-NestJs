import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity.js';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto.js';
import { UpdateCategoryDto } from './dtos/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private CategoryRepo: Repository<CategoryEntity>,
  ) {}

  async createCat(data: CreateCategoryDto): Promise<CategoryEntity> {
    const capName = data.name
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const existName = await this.CategoryRepo.findOneBy({ name: capName });

    if (existName) {
      throw new ConflictException('Category already exists');
    }

    const create = this.CategoryRepo.create({
      ...data,
      name: capName,
    });
    return this.CategoryRepo.save(create);
  }

  async updateCat(id: number, data: UpdateCategoryDto) {
    const category = await this.CategoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Data at id:-${id} , not found`);
    }

    await this.CategoryRepo.update(id, { ...data });

    return this.CategoryRepo.findOneBy({ id });
  }

  async getAll() {
    return this.CategoryRepo.find();
  }

  async getById(id: number) {
    const category = await this.CategoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Data at id:-${id} , not found`);
    }

    return {
      message: 'Data Fetch Successfully',
      data: category,
    };
  }

  async deleteCat(id: number) {
    const category = await this.CategoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Data at id:-${id} , not found`);
    }
    await this.CategoryRepo.delete(id);

    return {
      message: 'Data Delete Successfully',
      data: category,
    };
  }
}
