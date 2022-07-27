import { IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id customer of Order' })
  readonly customerId: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
