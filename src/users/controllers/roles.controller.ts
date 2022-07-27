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

import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { RoleEnum } from '../../auth/models';
import { Roles } from '../../auth/decorators';
import { RolesService } from '../services';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Find all roles, required admin role' })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Find a role by id, required admin role' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a role, required admin role' })
  @Post()
  create(@Body() payload: CreateRoleDto) {
    return this.rolesService.create(payload);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update a role, required admin role' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, payload);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a role, required admin role' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
