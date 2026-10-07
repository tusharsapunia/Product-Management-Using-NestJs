import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity.js';
import { Order } from './entity/order.entity.js';
import { OrderItem } from './entity/orderItem.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, OrderItem])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
