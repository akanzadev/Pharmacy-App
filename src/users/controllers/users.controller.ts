import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';

import { CreateUserDto, UpdateUserDto, CreateUserPrivateDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { RoleEnum } from '../../auth/models';
import { Public, Roles } from '../../auth/decorators';
import { UsersService } from '../services';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Find all users, required admin role' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Find a user by id' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a user' })
  @Post('create')
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a user only admins, required admin role' })
  @Post('create/private')
  createPrivate(@Body() payload: CreateUserPrivateDto) {
    return this.usersService.createPrivateUser(payload);
  }

  @Roles(RoleEnum.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(id, payload);
  }

  @Public()
  // @Roles(RoleEnum.CUSTOMER)
  @ApiOperation({ summary: 'Delete a user and customer related data' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
