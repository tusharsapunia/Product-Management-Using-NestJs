import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderDTO } from './DTOs/order.dto.js';
import { partialOrder } from './DTOs/partial.dto.js';
import { timeStamp } from 'console';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() Data: OrderDTO) {
    return this.orderService.createOrder(Data);
  }

  @Patch(':id')
  async updateData(@Param('id') id: number, @Body() data: partialOrder) {
    return this.orderService.updateOrder(id, data);
  }

  @Get()
  async getAll() {
    return this.orderService.getAll();
  }

  @Get(':id')
  async getbyId(@Param('id') id: number) {
    return this.orderService.getById(id);
  }
}
