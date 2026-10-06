import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity.js';
import { Order } from './order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
