import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto, UpdateOrderDto } from './../dtos';
import { Order, Customer, User } from '../../database/entities/users';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async ordersByCustomer(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['customer'],
    });
    if (!user) throw new NotFoundException(`User #${userId} not found`);
    const orders = await this.orderRepo.find({
      where: { customer: { id: user.customer.id } },
      relations: ['items', 'items.product'],
    });
    if (orders.length === 0) throw new NotFoundException('No orders found');
    return orders;
  }

  async findAll() {
    const orders = await this.orderRepo.find({
      select: ['id', 'customer','items', 'items.product'],
      relations: ['customer'],
    });
    if (orders.length === 0) throw new NotFoundException('No orders found');
    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'customer'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(data: CreateOrderDto) {
    const order = new Order();
    if (data.customerId) {
      order.customer = await this.validateCustomer(data.customerId);
    }
    return this.orderRepo.save(order);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this.validateNotFound(id);
    if (changes.customerId) {
      order.customer = await this.validateCustomer(changes.customerId);
    }
    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.validateNotFound(id);
    await this.orderRepo.delete(order.id);
    return {
      message: `Order #${id} deleted`,
    };
  }

  private async validateNotFound(id: number) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  private async validateCustomer(id: number) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }
}
