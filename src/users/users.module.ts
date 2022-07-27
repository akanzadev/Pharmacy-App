import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import {
  CustomersController,
  OrderItemController,
  OrdersController,
  ProfileController,
  RolesController,
  UsersController,
} from './controllers';
import {
  CustomersService,
  OrderItemService,
  OrdersService,
  RolesService,
  UsersService,
} from './services';

@Module({
  controllers: [
    CustomersController,
    OrderItemController,
    OrdersController,
    ProfileController,
    RolesController,
    UsersController,
  ],
  exports: [],
  imports: [AuthModule],
  providers: [
    CustomersService,
    OrderItemService,
    OrdersService,
    RolesService,
    UsersService,
  ],
})
export class UsersModule {}
