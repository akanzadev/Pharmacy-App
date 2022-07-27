import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { DateAt } from '../../../common/entities';
import { Product } from '.';

@Entity({ name: 'pharmacy' })
export class Pharmacy extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @OneToMany(() => Product, (product) => product.pharmacy)
  products: Product[];
}
