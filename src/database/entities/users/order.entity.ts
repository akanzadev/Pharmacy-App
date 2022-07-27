import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Customer, OrderItem } from '.';
import { DateAt } from '../../../common/entities';
@Entity({ name: 'orders' })
export class Order extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Expose()
  get products() {
    if (!this.items) return [];
    return this.items
      .filter((item) => !!item)
      .map((item) => ({
        ...item.product,
        quantity: item.quantity,
        itemId: item.id,
      }));
  }

  @Expose()
  get total() {
    if (!this.items) return 0;
    return this.items
      .filter((item) => !!item)
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
