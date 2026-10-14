import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Order } from '../order/entity/order.entity.js';
import { SupabaseProvider } from '../../external/supabase/supabase.provider.js';
import { image } from '../../shared/util/upload-image.js';
import { CategoryEntity } from '../category/entity/category.entity.js';
import { AuthEntity } from '../auth/entity/auth.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, AuthEntity,CategoryEntity])],
  providers: [ProductService, SupabaseProvider, image],
  controllers: [ProductController],
})
export class ProductModule {}
