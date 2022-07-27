import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { DateAt } from '../../../common/entities';
import { Product } from '.';
import { User } from '../users';

@Entity({ name: 'pharmacy' })
export class Pharmacy extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @OneToOne(() => User, (user) => user.pharmacy, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, (product) => product.pharmacy)
  products: Product[];
}
