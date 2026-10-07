import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity.js';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity.js';
import { OrderDTO } from './dtos/order.dto.js';
import { partialOrder } from './dtos/partial.dto.js';
import { StatusOrder } from './dtos/statusorder.dto.js';
import { OrderItem } from './entity/orderItem.entity.js';
import { constants } from 'buffer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private OrderRepository: Repository<Order>,
    @InjectRepository(Product) private ProductRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private OrderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(data: OrderDTO) {
    const products = [];
    let TotalAmount = 0;
    let Reststock = 0;

    for (const item of data.products) {
      const product = await this.ProductRepository.findOneBy({
        id: item.productId,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      Reststock += item.quantity;
      if (product.stock < Reststock) {
        throw new NotFoundException(
          `we have not enough stock for product id ${product.id}`,
        );
      }
      let stock = product.stock - Reststock;
      TotalAmount += product.price;
      this.ProductRepository.update(product.id, { stock: stock });

      products.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
      });
    }

    const order = this.OrderRepository.create({
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      amount: TotalAmount,
      status: data.status,
    });
    const save = await this.OrderRepository.save(order);
    products.forEach((elem) => {
      const orderItem = this.OrderItemRepository.create({
        orderId: save.id,
        productId: elem.productId,
        productName: elem.productName,
        quantity: elem.quantity,
      });
      this.OrderItemRepository.save(orderItem);
    });

    return save;
  }

  //
  async updateOrder(id: number, data: partialOrder) {
    const order = await this.OrderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    await this.OrderRepository.update(id, {
      name: data.customername,
      mobile: data.MobileNumber,
      address: data.Address,
    });

    return await this.OrderRepository.findOneBy({ id });
  }

  async updateStatus(id: number, data: StatusOrder) {
    const order = await this.OrderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    if (order.status === 'CANCELLED') {
      throw new NotFoundException('Order is Already Cancelled ');
    }
    if (data.status === 'CANCELLED') {
      const orderItems = await this.OrderItemRepository.find({
        where: {
          orderId: id,
        },
      });
      for (const item of orderItems) {
        const product = await this.ProductRepository.findOneBy({
          id: item.productId,
        });

        if (product) {
          let stock = product.stock + item.quantity;
          await this.ProductRepository.update(product.id, {
            stock: stock,
          });
        }
      }
    }
    await this.OrderRepository.update(id, {
      status: data.status,
    });

    return await this.OrderRepository.findOneBy({ id });
  }

  //
  //
  //
  async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.OrderRepository.findAndCount({
      where: search
        ? {
            name: search,
          }
        : {},
      skip,
      take: limit,
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getById(id: number): Promise<Order | null> {
    const Data = await this.OrderRepository.findOneBy({ id });
    if (!Data) {
      throw new NotFoundException('Order Not found');
    }
    return Data;
  }

  //
}
