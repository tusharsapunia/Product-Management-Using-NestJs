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
import { ProductDTO } from './Dtos/product.dto.js';
import { PartialProduct } from './Dtos/partial.dto.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Post Method:-
  @Post()
  async createProduct(@Body() data: ProductDTO) {
    return this.productService.createProduct(data);
  }

  //Get Method:-
  @Get()
  async getAll() {
    return this.productService.getAllProduct();
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  //Put Method:-

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: ProductDTO) {
    return this.productService.updateProduct(id, data);
  }

  @Patch(':id')
  async patchupdate(@Param('id') id: number, @Body() data: PartialProduct) {
    return this.productService.patchUpdate(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.productDelete(id);
  }
}
