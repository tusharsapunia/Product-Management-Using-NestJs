import { Inject, Injectable, NotFoundException, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './Dtos/product.dto.js';
import { Product } from './product.entity.js';
import { Repository } from 'typeorm';
import { PartialProduct } from './Dtos/partial.dto.js';
import { SUPABASE_CLIENT } from './supabase/supabase.provider.js';
import { SupabaseClient } from '@supabase/supabase-js';
import { image } from '../util/upload-image.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private ProductRepo: Repository<Product>,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly UploadImage: image,
  ) {}

  //Method For insert Product:-
  async createProduct(data: ProductDTO): Promise<Product> {
    let Url = await this.UploadImage.uploadImage(data.image);
    let status = '';
    if (data.stock > 0) {
      status = 'ACTIVE';
    } else {
      status = 'INACTIVE';
    }

    const newProduct = this.ProductRepo.create({
      ...data,
      image: Url,
      status: status,
    });
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
    let Url = await this.UploadImage.uploadImage(data.image);
    let status = '';
    if (data.stock > 0) {
      status = 'ACTIVE';
    } else {
      status = 'INACTIVE';
    }
    await this.ProductRepo.update(id, {
      ...data,
      image: Url,
      status: status,
    });
    return await this.ProductRepo.findOneBy({ id });
  }

  async patchUpdate(
    id: number,
    data:PartialProduct,
  ): Promise<Product | null> {
    const Data = await this.ProductRepo.findOneBy({ id });

    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }

    let Url = Data.image;
    if (!data.image) {
      Url = Data.image;
    } else {
      Url = await this.UploadImage.uploadImage(data.image);
    }
    let status = Data.status;
    if (!data.stock) {
      status = Data.status;
    } else if (data.stock > 0) {
      status = 'ACTIVE';
    } else {
      status = 'INACTIVE';
    }

    console.log('CATEgry-----', data);
    await this.ProductRepo.update(id, {
      ...((data.category != undefined || data.category != '') && {
        category: data.category,
      }),
      image: Url,
      status: status,
    });
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
