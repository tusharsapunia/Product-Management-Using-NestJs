import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity.js';
import { AuthEntity } from '../../auth/entity/auth.entity.js';
import type { Relation } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => AuthEntity)
  @JoinColumn({ name: 'userId' })
  userId: Relation<AuthEntity>;

  @Column({ type: 'bigint' })
  mobile: bigint;

  @Column()
  address: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @Column()
  amount: number;

  @Column()
  status: string;
}
