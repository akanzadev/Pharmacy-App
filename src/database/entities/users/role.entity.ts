import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { DateAt } from '../../../common/entities';
import { RoleEnum } from '../../../auth/models';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.CUSTOMER,
  })
  name: RoleEnum;

  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
