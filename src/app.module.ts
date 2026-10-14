import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './modules/order/order.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CategoryModule } from './modules/category/category.module.js';
import { MailModule } from './modules/mail/mail.module.js';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),

    OrderModule,

    AuthModule,

    CategoryModule,

    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
