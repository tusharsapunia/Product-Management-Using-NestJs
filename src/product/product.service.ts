import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './Dtos/product.dto.js';
import { Product } from './product.entity.js';
import { Repository } from 'typeorm';
import { PartialProduct } from './Dtos/partial.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private ProductRepo: Repository<Product>,
  ) {}

  //Method For insert Product:-
  async createProduct(data: ProductDTO): Promise<Product> {
    const newProduct = this.ProductRepo.create(data);
    return this.ProductRepo.save(newProduct);
  }
  //Get Products:-
  async getAllProduct(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.ProductRepo.findAndCount({
      where: search
        ? {
            name: search,
          }
        : {},
      skip,
      take: limit,
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getProductById(id: number): Promise<Product> {
    const Data = await this.ProductRepo.findOneBy({ id });
    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }
    return Data;
  }

  async updateProduct(id: number, data: ProductDTO): Promise<Product | null> {
    const Data = await this.ProductRepo.findOneBy({ id });
    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }
    await this.ProductRepo.update(id, { stock: 7 });
    return await this.ProductRepo.findOneBy({ id });
  }

  async patchUpdate(id: number, data: PartialProduct): Promise<Product | null> {
    const Data = await this.ProductRepo.findOneBy({ id });
    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }
    await this.ProductRepo.update(id, data);
    return await this.ProductRepo.findOneBy({ id });
  }

  async productDelete(id: number): Promise<Product | null> {
    const Data = await this.ProductRepo.findOneBy({ id });
    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }
    await this.ProductRepo.delete({ id });

    return Data;
  }
}
