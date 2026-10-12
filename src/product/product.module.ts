import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Order } from '../order/entity/order.entity.js';
import { SupabaseProvider } from './supabase/supabase.provider.js';
import { image } from '../util/upload-image.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order])],
  providers: [ProductService, SupabaseProvider, image],
  controllers: [ProductController],
})
export class ProductModule {}
