import { Inject, Injectable, NotFoundException, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dtos/product.dto.js';
import { Product } from './product.entity.js';
import { Repository } from 'typeorm';
import { PartialProduct } from './dtos/partial.dto.js';
import { SUPABASE_CLIENT } from '../../external/supabase/supabase.provider.js';
import { SupabaseClient } from '@supabase/supabase-js';
import { image } from '../../shared/util/upload-image.js';
import { CategoryEntity } from '../category/entity/category.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private ProductRepo: Repository<Product>,
    @InjectRepository(CategoryEntity)
    private CategoryRepo: Repository<CategoryEntity>,
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
      name: data.name,
      price: data.price,
      stock: data.stock,
      category: { id: data.categoryId },
      image: Url,
      status: status,
    });
    return this.ProductRepo.save(newProduct);
  }
  //Get Products:-
  async getAllProduct(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.ProductRepo.findAndCount({
      relations: {
        category: true,
      },
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
    const Data = await this.ProductRepo.findOne({
      where: { id },
      relations: { category: true },
    });
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
    const { categoryId, ...ProductData } = data;
    const category = await this.CategoryRepo.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException('Category not Found...');
    }
    let Url = await this.UploadImage.uploadImage(data.image);
    let status = '';
    if (data.stock > 0) {
      status = 'ACTIVE';
    } else {
      status = 'INACTIVE';
    }
    await this.ProductRepo.update(id, {
      ...ProductData,
      category,
      image: Url,
      status: status,
    });
    return await this.ProductRepo.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
  }

  async patchUpdate(id: number, data: PartialProduct): Promise<Product | null> {
    const Data = await this.ProductRepo.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }

    let Url = Data.image;

    if (data.image) {
      Url = await this.UploadImage.uploadImage(data.image);
    }

    let status = Data.status;

    if (data.stock !== undefined && data.stock !== null) {
      status = data.stock > 0 ? 'ACTIVE' : 'INACTIVE';
    }

    let price = Data.price;
    let stock2 = Data.stock;
    let name = Data.name;
    let category1 = Data.category.id;

    if (data.price !== undefined && data.price !== null && data.price !== 0) {
      price = data.price;
    }

    if (data.name !== undefined && data.name !== '') {
      name = data.name;
    }

    if (data.stock !== undefined && data.stock !== null && data.stock !== 0) {
      stock2 = data.stock;
    }
    if (
      data.categoryID !== undefined &&
      data.categoryID !== null &&
      data.categoryID !== 0
    ) {
      const category = await this.CategoryRepo.findOneBy({
        id: Number(data.categoryID),
      });

      if (!category) {
        throw new NotFoundException('Category Not found..');
      }
      category1 = category.id;
    }

    await this.ProductRepo.update(id, {
      name: name,
      price: price,
      stock: stock2,
      category: { id: category1 },
      image: Url,
      status: status,
    });

    return await this.ProductRepo.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async productDelete(
    id: number,
  ): Promise<{ message: string; data: Product | null }> {
    const Data = await this.ProductRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!Data) {
      throw new NotFoundException('ProductNot Found...');
    }
    await this.ProductRepo.delete(id);

    return {
      message: 'Product Delete Successfully',
      data: Data,
    };
  }
}
