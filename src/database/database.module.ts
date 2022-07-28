import { ConfigType } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Pharmacy } from './entities/products';
import config from '../config';
import { dataSource } from './data-source';
import {
  Customer,
  Order,
  OrderItem,
  Role,
  Source,
  User,
} from './entities/users';

/* const datasourc = dataSource();
console.log(datasourc); */

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        const {
          postgres: { dbName, host, password, port, user, url },
          scope: { nodeEnv },
        } = configService;
        if (nodeEnv === 'production') {
          return {
            type: 'postgres',
            url,
            synchronize: false,
            logging: false,
            autoLoadEntities: true,
            ssl: { rejectUnauthorized: false },
          };
        } else {
          return {
            type: 'postgres',
            host,
            port,
            username: user,
            password,
            database: dbName,
            synchronize: false,
            logging: false,
            autoLoadEntities: true,
            ssl: false,
          };
        }
      },
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
