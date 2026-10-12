import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Search,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductDTO } from './Dtos/product.dto.js';
import { PartialProduct } from './Dtos/partial.dto.js';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Post Method:-

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() data: ProductDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    data.image = image;
    return this.productService.createProduct(data);
  }

  //Get Method:-
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'string',
  })
  async getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.productService.getAllProduct(
      Number(page),
      Number(limit),
      search,
    );
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  //Put Method:-
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() data: ProductDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    data.image = image;
    return this.productService.updateProduct(id, data);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async patchupdate(
    @Param('id') id: number,
    @Body() data: PartialProduct,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image) {
      data.image = image;
    }
    return this.productService.patchUpdate(id, data);
  }
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.productDelete(id);
  }
}
