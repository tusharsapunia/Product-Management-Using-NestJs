import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderDTO } from './dtos/order.dto.js';
import { partialOrder } from './dtos/partial.dto.js';
import { StatusOrder } from './dtos/statusorder.dto.js';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() Data: OrderDTO) {
    return this.orderService.createOrder(Data);
  }

  @Patch('update/:id')
  async updateData(@Param('id') id: number, @Body() data: partialOrder) {
    return this.orderService.updateOrder(id, data);
  }
  @Patch('status/:id')
  async updateStatus(@Param('id') id: number, @Body() data: StatusOrder) {
    return this.orderService.updateStatus(id, data);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
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
  getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.orderService.getAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  async getbyId(@Param('id') id: number) {
    return this.orderService.getById(id);
  }
}
