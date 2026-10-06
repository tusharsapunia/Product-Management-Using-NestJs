import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  mobile: number;
  @Column()
  address: string;
  @Column({ type: 'jsonb' })
  products: {
    productId: number;
    quantity: number;
  }[];
  @Column()
  amount: number;
  @Column()
  status: string;
}
