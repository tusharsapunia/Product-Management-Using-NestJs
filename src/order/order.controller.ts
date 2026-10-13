import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderDTO } from './dtos/order.dto.js';
import { partialOrder } from './dtos/partial.dto.js';
import { StatusOrder } from './dtos/statusorder.dto.js';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrderQueries } from '../decorators/queries.decorator.js';

// @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() Data: OrderDTO, @Req() req: any) {
    return this.orderService.createOrder(Data, req.user);
  }

  @Patch('update/:id')
  async updateData(
    @Param('id') id: number,
    @Body() data: partialOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateOrder(id, data, req.user.userId);
  }

  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: StatusOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateStatus(id, data, req.user.userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  @OrderQueries()
  getAll(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.orderService.getAll(
      req.user.userId,

      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  async getbyId(@Param('id') id: number, @Request() req: any) {
    // console.log(req.user);
    return this.orderService.getById(id, req.user.userId);
  }
}
