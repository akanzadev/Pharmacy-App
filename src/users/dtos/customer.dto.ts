import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of Customer', default: 'John' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of Customer', default: 'Doe' })
  readonly lastname: string;

  @IsOptional()
  @IsPhoneNumber('PE')
  @ApiProperty({
    description: 'The phone of Customer',
    default: '+51 9876543' + Math.floor(Math.random() * (99 - 10 + 1) + 10),
  })
  readonly phone: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
