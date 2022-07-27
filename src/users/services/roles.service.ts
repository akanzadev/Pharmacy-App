import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { Role } from '../../database/entities/users';
import { RoleEnum } from '../../auth/models';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  async findAll() {
    const roles = await this.roleRepo.find();
    if (roles.length === 0) throw new NotFoundException('No roles found');
    return roles;
  }

  async findOne(id: number) {
    const roles = await this.roleRepo.findOne(id);
    if (!roles) throw new NotFoundException(`Roles #${id} not found`);
    return roles;
  }

  async create(data: CreateRoleDto) {
    await this.validateNameUnique(data.name);
    const newRole = this.roleRepo.create(data);
    return this.roleRepo.save(newRole);
  }

  async update(id: number, changes: UpdateRoleDto) {
    const role = await this.validateNotFound(id);
    await this.validateNameUnique(changes.name);
    await this.validateDescriptionUnique(changes.description);
    this.roleRepo.merge(role, changes);
    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.validateNotFound(id);
    await this.roleRepo.delete(role.id);
    return {
      message: `Role #${id} deleted`,
    };
  }

  private async validateNotFound(id: number) {
    const role = await this.roleRepo.findOne(id);
    if (!role) throw new NotFoundException(`Roles #${id} not found`);
    return role;
  }

  private async validateNameUnique(name: RoleEnum) {
    const role = await this.roleRepo.findOne({ where: { name } });
    if (role) throw new BadRequestException('Name is already taken');
  }

  private async validateDescriptionUnique(description: string) {
    const role = await this.roleRepo.findOne({ where: { description } });
    if (role) {
      throw new BadRequestException('Roles cannot have the same description');
    }
  }
}
