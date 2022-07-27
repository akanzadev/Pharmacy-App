import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPositive,
  MinLength,
} from 'class-validator';
import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCustomerDto } from './customer.dto';

export class CreateUserDto extends CreateCustomerDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of User', default: 'admin@gmail.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'The password of User', default: '123456789' })
  readonly password: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}

export class CreateUserPrivateDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of User', default: 'admin@gmail.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'The password of User', default: '123456789' })
  readonly password: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: 'The id role of User', default: '1' })
  readonly roleId: number;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: 'The id source of User', default: '1' })
  readonly sourceId: number;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: 'The id customer of User', default: '1' })
  readonly customerId: number;
}

export class UpdatePrivateUserDto extends PartialType(
  OmitType(CreateUserPrivateDto, ['password']),
) {}
