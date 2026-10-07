import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity.js';
import type { Relation } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productName: string;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItem)
  order: Relation<Order>;
}
