import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { OrdersService } from '../services';
import { PayloadToken, RoleEnum } from './../../auth/models';
import { Roles } from '../../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private orderService: OrdersService) {}

  @Roles(RoleEnum.CUSTOMER)
  @Get('my-orders')
  @ApiOperation({ summary: 'Find all orders, required login' })
  getOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.orderService.ordersByCustomer(user.sub);
  }
}
