import { Exclude, Expose } from 'class-transformer';
import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';

import { DateAt } from '../../../common/entities';
import { Order } from '.';
import { Product } from '../products';

@Entity()
export class OrderItem extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Product, {
    nullable: false,
  })
  product: Product;

  @Exclude()
  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
  })
  order: Order;

  @Expose()
  get orderId() {
    return this.order ? this.order.id : null;
  }
}
