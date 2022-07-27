import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of Brand',
    default: 'Brand' + Math.floor(Math.random() * 100),
  })
  readonly name: string;

  /*
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'The image of Brand',
    default: 'https://picsum.photos/200/300/' + Math.floor(Math.random() * 100),
  })
  readonly image: string; */
}

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {}
