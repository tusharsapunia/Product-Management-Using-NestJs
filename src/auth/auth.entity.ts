import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/entity/order.entity.js';

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  mobileNumber: bigint;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order)
  order: Order[];
}
