import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomerDto, UpdateCustomerDto } from '../dtos';
import { Customer } from '../../database/entities/users';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    const customers = await this.customerRepo.find();
    if (customers.length === 0) {
      throw new NotFoundException('No customers found');
    }
    return customers;
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }

  async create(data: CreateCustomerDto) {
    await this.validatePhoneUnique(data.phone);
    const newCustomer = this.customerRepo.create(data);
    return this.customerRepo.save(newCustomer);
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const customer = await this.validateNotFound(id);
    if (changes.phone) await this.validatePhoneUnique(changes.phone);
    this.customerRepo.merge(customer, changes);
    return this.customerRepo.save(customer);
  }

  async remove(id: number) {
    const customer = await this.validateNotFound(id);
    await this.customerRepo.delete(customer.id);
    return {
      message: `Customer #${id} deleted`,
    };
  }

  private async validateNotFound(id: number) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }

  private async validatePhoneUnique(phone: string) {
    const customer = await this.customerRepo.findOne({ where: { phone } });
    if (customer) throw new BadRequestException('Phone is already registered');
  }
}
