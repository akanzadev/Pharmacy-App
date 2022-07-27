import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of Product',
    default: 'Product' + new Date().getTime(),
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of Product',
    default: 'Product description' + new Date().getTime(),
  })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'The price of Product',
    default: Math.floor(Math.random() * 100),
  })
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'The quantity of Product',
    default: Math.floor(Math.random() * 100),
  })
  readonly stock: number;

  /* @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The image of Product',
    default: 'https://picsum.photos/200/300',
  })
  readonly image: string; */

  // Fecha de expiracion
  @IsNotEmpty()
  @ApiProperty({
    description: 'The expiration date of Product',
    default: new Date(),
  })
  readonly expirationDate: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The pharmacy of Product',
    default: Math.floor(Math.random() * 100),
  })
  readonly pharmacyId: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The limit of Products',
    default: 10,
  })
  limit: number;

  @IsOptional()
  @Min(0)
  @ApiProperty({
    description: 'The offset of Products',
    default: 0,
  })
  offset: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The max price of Products',
    default: 100,
  })
  minPrice: number;

  @ValidateIf((item) => item.minPrice)
  @IsPositive()
  @ApiProperty({
    description: 'The min price of Products',
    default: 200,
  })
  maxPrice: number;
}
