import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Order } from '../order/order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
