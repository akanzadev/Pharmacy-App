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

import { CreateCustomerDto, UpdateCustomerDto } from '../dtos';
import { CustomersService } from '../services';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { RoleEnum } from '../../auth/models';
import { Roles } from '../../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Find all customers, required admin role' })
  @Get()
  async findAll() {
    return await this.customersService.findAll();
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Find a customer by id, required login' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a customer, required admin role' })
  @Post()
  create(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Update a customer, required login' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a customer, required admin role' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
