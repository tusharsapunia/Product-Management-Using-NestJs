import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity.js';
import { OrderDTO } from './DTOs/order.dto.js';
import { partialOrder } from './DTOs/partial.dto.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private OrderRepository: Repository<Order>,
    @InjectRepository(Product) private ProductRepository: Repository<Product>,
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
        quantity: item.quantity,
      });
    }

    const order = this.OrderRepository.create({
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      products,
      amount: TotalAmount,
      status: data.status,
    });

    return this.OrderRepository.save(order);
  }

  //
  async updateOrder(id: number, data: partialOrder) {
    const order = await this.OrderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    if (data.status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.products) {
        const product = await this.ProductRepository.findOneBy({
          id: item.productId,
        });

        if (product) {
          await this.ProductRepository.update(product.id, {
            stock: product.stock + item.quantity,
          });
        }
      }
    }

    await this.OrderRepository.update(id, {
      name: data.customername,
      mobile: data.MonilNumber,
      address: data.Address,
      status: data.status,
    });

    return await this.OrderRepository.findOneBy({ id });
  }

  async getAll(): Promise<Order[]> {
    return this.OrderRepository.find();
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
