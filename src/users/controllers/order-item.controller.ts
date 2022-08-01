import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateOrderItemDto } from './../dtos';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { OrderItemService } from './../services';
import { RoleEnum } from '../../auth/models';
import { Roles } from '../../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Order-Items')
@Controller('order-item')
export class OrderItemController {
  constructor(private itemsService: OrderItemService) {}

  @Roles(RoleEnum.MEDIC)
  @ApiOperation({ summary: 'Get all order items, required login' })
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Roles(RoleEnum.MEDIC)
  @ApiOperation({ summary: 'Get an order item by id, required login' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Roles(RoleEnum.MEDIC)
  @ApiOperation({ summary: 'Create an order item, required login' })
  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.itemsService.create(payload);
  }
}
