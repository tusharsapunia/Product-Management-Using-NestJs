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
import { OrderQueries } from '../../core/decorators/queries.decorator.js';
import { StoreOrderStatusDTO } from './dtos/storeOrderStatus.dto.js';
import { PermissionsGuard } from '../../core/guards/permission/permission.guard.js';
import { Permissions } from '../../core/decorators/permission.decorator.js';

// @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:create')
  @Post()
  async createOrder(@Body() Data: OrderDTO, @Req() req: any) {
    return this.orderService.createOrder(Data, req.user);
  }

  // @UseGuards(AuthGuard('jwt'))

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:read')
  @Get()
  @OrderQueries()
  getAll(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.orderService.getAll(
      req.user,

      Number(page),
      Number(limit),
      search,
    );
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:read')
  @Get(':id')
  async getbyId(@Param('id') id: number, @Request() req: any) {
    // console.log(req.user);
    return this.orderService.getById(id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:update')
  @Patch('update/:id')
  async updateData(
    @Param('id') id: number,
    @Body() data: partialOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateOrder(id, data, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:update')
  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: StatusOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateStatus(id, data, req.user.userId);
  }

  /// Store Can  do thi
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:read-store')
  @Get('store/getall')
  @OrderQueries()
  getAllBYStore(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.orderService.GetAllOrder(Number(page), Number(limit), search);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:read-store')
  @Get('store/getbyid/:id')
  async getOneBYStore(@Param('id') id: number) {
    return this.orderService.GETBYID(id);
  }

  // Update status by Store/Admin
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('order:update-status')
  @Patch('store/status/:id')
  async storeStatusupdate(
    @Param('id') id: number,
    @Body() data: StoreOrderStatusDTO,
  ) {
    return this.orderService.storeStatusupdate(id, data);
  }
}
