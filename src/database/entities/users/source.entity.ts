import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DateAt } from '../../../common/entities';
import { SourceEnum } from '../../../auth/models';
import { User } from '.';

@Entity({ name: 'source' })
export class Source extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SourceEnum,
    default: SourceEnum.EMAIL,
    unique: true,
  })
  name: SourceEnum;

  @OneToOne(() => User, (user) => user.source, {
    nullable: true,
  })
  users: User[];
}
