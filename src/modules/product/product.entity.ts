import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CategoryEntity } from '../category/entity/category.entity.js';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => CategoryEntity, (cate) => cate.products)
  category: CategoryEntity;

  @Column()
  status: string;

  @Column()
  image: string;
}
