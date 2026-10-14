import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entity/order.entity.js';

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  mobileNumber: bigint;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order)
  order: Order[];

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  hashOtp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date | null;
}
