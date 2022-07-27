import { ConfigType } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Pharmacy } from './entities/products';
import config from 'src/config';
import {
  Customer,
  Order,
  OrderItem,
  Role,
  Source,
  User,
} from './entities/users';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async ({ postgres }: ConfigType<typeof config>) => ({
        type: 'postgres',
        host: postgres.host,
        port: postgres.port,
        username: postgres.user,
        password: postgres.password,
        database: postgres.dbName,
        synchronize: false,
        logging: true,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Pharmacy,
      Customer,
      Order,
      OrderItem,
      Product,
      Role,
      Source,
      User,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
