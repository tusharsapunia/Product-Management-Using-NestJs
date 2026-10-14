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
import { RolesGuard } from '../../core/guards/roles/roles.guard.js';
import { Roles } from '../../core/decorators/roles.decorator.js';
import { Role } from '../../shared/enum/roles.enum.js';
import { StoreOrderStatusDTO } from './dtos/storeOrderStatus.dto.js';

// @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post()
  async createOrder(@Body() Data: OrderDTO, @Req() req: any) {
    return this.orderService.createOrder(Data, req.user);
  }

  // @UseGuards(AuthGuard('jwt'))

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Get(':id')
  async getbyId(@Param('id') id: number, @Request() req: any) {
    // console.log(req.user);
    return this.orderService.getById(id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Patch('update/:id')
  async updateData(
    @Param('id') id: number,
    @Body() data: partialOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateOrder(id, data, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: StatusOrder,
    @Request() req: any,
  ) {
    return this.orderService.updateStatus(id, data, req.user.userId);
  }

  /// Store Can  do thi

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
  @Get('store')
  @OrderQueries()
  getAllBYStore(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.orderService.GetAllOrder(Number(page), Number(limit), search);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
  @Get('store/:id')
  async getOneBYStore(@Param('id') id: number) {
    return this.orderService.GETBYID(id);
  }

  // Update status by Store/Admin
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STORE)
  @Patch('store/status/:id')
  async storeStatusupdate(
    @Param('id') id: number,
    @Body() data: StoreOrderStatusDTO,
  ) {
    return this.orderService.storeStatusupdate(id, data);
  }
}
