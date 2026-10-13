import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity.js';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity.js';
import { OrderDTO } from './dtos/order.dto.js';
import { partialOrder } from './dtos/partial.dto.js';
import { StatusOrder } from './dtos/statusorder.dto.js';
import { OrderItem } from './entity/orderItem.entity.js';
import { AuthEntity } from '../auth/auth.entity.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private OrderRepository: Repository<Order>,
    @InjectRepository(AuthEntity)
    private UserRepository: Repository<AuthEntity>,
    @InjectRepository(Product) private ProductRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private OrderItemRepository: Repository<OrderItem>,
    private readonly MailService: MailService,
  ) {}

  async createOrder(data: OrderDTO, req: any) {
    const products = [];
    let TotalAmount = 0;
    let Reststock = 0;
    let status = '';

    const { userId, name, mobile, email } = req;
    // console.log(email);

    for (const item of data.products) {
      if (!item.productId || !item.quantity) {
        return 'please Enter Valid Data';
      }
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
      status = 'PENDING';
      let stock = product.stock - Reststock;
      TotalAmount += product.price * item.quantity;
      this.ProductRepository.update(product.id, { stock: stock });

      products.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
      });
    }

    const order = this.OrderRepository.create({
      // ...req,
      userId: userId,
      name: name,
      mobile: mobile,
      address: data.address,
      amount: TotalAmount,
      status: status,
    });

    const save = await this.OrderRepository.save(order);
    const subject = `Order Confirmation for Id :- ${save.id}`;
    const text = `**Subject: Order Confirmed! 🎉 Your Order Has Been Placed Successfully**

        Hi { ${name},

        Great news! 🎉

        Thank you for shopping with us. We're happy to confirm that your order has been placed successfully.

        **Here are your order details:**

        - **Order ID:** {${save.id}}
        - **Total Amount:** ₹{${TotalAmount}}
        - **Order Status:** {${status}

        Our team is preparing your order, and we'll keep you updated as it moves through the delivery process.

        If you have any questions or need assistance, please feel free to contact our support team.

        Thank you for choosing us. We truly appreciate your trust and look forward to serving you again!

        Warm regards,  
        Thank you for shopping with us! ❤️`;

    try {
      await this.MailService.sendEmail(email, subject, text);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
  async updateOrder(id: number, data: partialOrder, req: any) {
    const order = await this.OrderRepository.findOneBy({ id, userId: req });

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

  async updateStatus(id: number, data: StatusOrder, req: any) {
    const order = await this.OrderRepository.findOneBy({ id, userId: req });

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
  async getAll(req: any, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.OrderRepository.findAndCount({
      where: {
        userId: req,
        ...(search ? { name: search } : {}),
      },
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

  async getById(id: number, user: any): Promise<Order | null> {
    const Data = await this.OrderRepository.findOneBy({
      id,
      userId: user,
    });
    if (!Data) {
      throw new NotFoundException('Order Not found');
    }
    return Data;
  }

  //
}
