import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RoleEnum, SourceEnum } from 'src/auth/models';
import { User, Customer, Role, Source } from '../../database/entities/users';
import {
  CreateUserDto,
  CreateUserPrivateDto,
  UpdatePrivateUserDto,
} from '../dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Source) private sourceRepo: Repository<Source>,
  ) {}

  async findAll() {
    const users = await this.userRepo.find({
      relations: ['customer'],
    });
    if (users.length === 0) throw new NotFoundException('No users found');
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id, {
      relations: ['customer', 'role'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    await this.validateEmailUnique(data.email);
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    newUser.customer = await this.customerRepo.save(
      this.customerRepo.create({
        name: data.name,
        lastname: data.lastname,
        phone: data.phone,
      }),
    );
    newUser.role = await this.roleRepo.findOne({
      where: { name: RoleEnum.CUSTOMER },
    });
    newUser.source = await this.sourceRepo.findOne({
      where: { name: SourceEnum.EMAIL },
    });
    const rta = await this.userRepo.save(newUser);
    const customer = await this.customerRepo.findOne(rta.customer.id);
    customer.user = rta;
    await this.customerRepo.save(customer);
    return rta;
  }

  async createPrivateUser(data: CreateUserPrivateDto) {
    await this.validateEmailUnique(data.email);
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    newUser.customer = await this.validateCustomer(data.customerId);
    newUser.role = await this.validateRole(data.roleId);
    newUser.source = await this.validateSource(data.sourceId);
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdatePrivateUserDto) {
    const user = await this.validateNotFound(id);
    if (changes.email) await this.validateEmailUnique(changes.email);
    if (changes.roleId) user.role = await this.validateRole(changes.roleId);
    if (changes.customerId) {
      user.customer = await this.validateCustomer(changes.customerId);
    }
    await this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.validateNotFound(id);
    const customer = await this.customerRepo.findOne(user.customer.id);
    await this.userRepo.remove(user);
    if (customer) await this.customerRepo.remove(customer);
    return {
      message: `User #${id} deleted`,
    };
  }

  private async validateNotFound(id: number) {
    const user = await this.userRepo.findOne(id, {
      relations: ['customer', 'role'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  private async validateEmailUnique(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) throw new BadRequestException(`${email} is already registered`);
  }

  private async validateCustomer(customerId: number) {
    const customer = await this.customerRepo.findOne(customerId);
    if (!customer) throw new NotFoundException('Customer not found');
    const user = await this.userRepo.findOne({
      where: { customer: customer.id },
    });
    if (user) throw new BadRequestException('Customer already registered');
    return customer;
  }
  private async validateRole(roleId: number) {
    const role = await this.roleRepo.findOne(roleId);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }
  private async validateSource(sourceId: number) {
    const source = await this.sourceRepo.findOne(sourceId);
    if (!source) throw new NotFoundException('Source not found');
    return source;
  }
}
