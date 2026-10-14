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
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductDTO } from './dtos/product.dto.js';
import { PartialProduct } from './dtos/partial.dto.js';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { OrderQueries } from '../../core/decorators/queries.decorator.js';
import { RolesGuard } from '../../core/guards/roles/roles.guard.js';
import { Roles } from '../../core/decorators/roles.decorator.js'; 
import { Role } from '../../shared/enum/roles.enum.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Post Method:-
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
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
  @OrderQueries()
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
  async getOne(@Param('id') id: number, @Request() req: any) {
    return this.productService.getProductById(id);
  }

  //Put Method:-
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.productDelete(id);
  }
}
