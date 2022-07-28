import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderItemDto, UpdateOrderItemDto } from './../dtos';
import { OrderItem, Order } from '../../database/entities/users';
import { Product } from '../../database/entities/products';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private OrderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    const orderItem = await this.OrderItemRepo.find({
      relations: ['order', 'order.customer'],
    });
    if (orderItem.length === 0) {
      throw new NotFoundException('No order items found');
    }
    return orderItem;
  }

  async findOne(id: number) {
    const orderItem = await this.OrderItemRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!orderItem) throw new NotFoundException(`Order item #${id} not found`);
    return orderItem;
  }

  async create({ orderId, productId, quantity }: CreateOrderItemDto) {
    const order = await this.validateOrder(orderId);
    const product = await this.validateProduct(productId);
    const orderItem = await this.OrderItemRepo.findOne({
      where: {
        order: {
          id: orderId,
        },
        product: {
          id: productId,
        },
      },
      relations: ['order', 'product'],
    });
    if (orderItem) {
      orderItem.quantity += quantity;
      return this.OrderItemRepo.save(orderItem);
    }
    const newOrderItem = new OrderItem();
    newOrderItem.order = order;
    newOrderItem.product = product;
    newOrderItem.quantity = quantity;
    return this.OrderItemRepo.save(newOrderItem);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const item = await this.validateNotFound(id);
    if (changes.orderId) item.order = await this.validateOrder(changes.orderId);
    if (changes.productId) {
      item.product = await this.validateProduct(changes.productId);
    }
    item.quantity = changes.quantity;
    return this.OrderItemRepo.save(item);
  }

  private async validateOrder(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }
  private async validateProduct(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  private async validateNotFound(id: number) {
    const item = await this.OrderItemRepo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Order item #${id} not found`);
    return item;
  }
}
