import { Module } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity.js';
import { Product } from '../product/product.entity.js';
import { Order } from '../order/entity/order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, Product, Order])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
