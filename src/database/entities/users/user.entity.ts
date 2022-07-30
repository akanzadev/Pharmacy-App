import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { DateAt } from '../../../common/entities';
import { Role, Customer, Source } from '.';
import { Pharmacy } from '../products';

@Entity({ name: 'users' })
export class User extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, unique: true })
  refreshToken: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Source, (source) => source.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @OneToOne(() => Pharmacy, (pharmacy) => pharmacy.user, {
    nullable: true,
  })
  pharmacy: Pharmacy;

  @OneToOne(() => Customer, (customer) => customer.user, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
