import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity.js';
import { RolesPermissionsEntity } from './role.entity.js';

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

  @ManyToOne(() => RolesPermissionsEntity, (role) => role.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: RolesPermissionsEntity;

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
