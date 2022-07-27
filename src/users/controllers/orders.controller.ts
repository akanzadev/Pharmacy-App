import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { OrdersService } from '../services';
import { RoleEnum } from '../../auth/models';
import { Roles } from '../../auth/decorators';
import { UpdateOrderDto, CreateOrderDto } from '../dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Get all orders, required login' })
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Get an order by id, required login' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Create an order, required login' })
  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.orderService.create(payload);
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Update an order, required login' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return this.orderService.update(id, payload);
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Delete an order, required login' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
