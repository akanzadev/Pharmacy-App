import { IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id order of OrderItem', default: 1 })
  readonly orderId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id product of OrderItem', default: 1 })
  readonly productId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The quantity of OrderItem',
    default: Math.floor(Math.random() * 100),
  })
  readonly quantity: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
