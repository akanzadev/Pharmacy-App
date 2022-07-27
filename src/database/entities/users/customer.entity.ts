import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateAt } from '../../../common/entities';
import { User, Order } from '.';
@Entity({ name: 'customers' })
export class Customer extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  phone: string;

  @OneToOne(() => User, (user) => user.customer, {
    nullable: true,
  })
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
