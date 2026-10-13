import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './product/product.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoryModule } from './category/category.module.js';
import { MailModule } from './mail/mail.module.js';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
