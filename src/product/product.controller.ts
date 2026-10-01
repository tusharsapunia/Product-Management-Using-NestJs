import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //GET Method :-
  @Get()
  getProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  //POST Method :-
  @Post()
  createNew(
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      status: string;
    },
  ) {
    return this.productService.createNew(body);
  }

  //DELETE Method :-
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.deleteOne(id);
  }

  // POST Method :-
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      status: string;
    },
  ) {
    return this.productService.update(id, body);
  }
  //PATCH Method:-
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      status: string;
    }>,
  ) {
    return this.productService.patchUpdate(id, body);
  }
}
