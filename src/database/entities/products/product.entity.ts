import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pharmacy } from '.';
import { DateAt } from '../../../common/entities';

@Entity({ name: 'products' })
@Index(['price', 'stock'])
export class Product extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'date' })
  expirationDate: Date;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.products)
  @JoinColumn({ name: 'pharmacy_id' })
  pharmacy: Pharmacy;
}
