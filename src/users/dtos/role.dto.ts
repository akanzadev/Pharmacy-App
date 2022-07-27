import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../auth/models/roles.model';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  @ApiProperty({ description: 'The name of Role', default: RoleEnum.CUSTOMER })
  readonly name: RoleEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of Role',
    default: 'Administrator' + Math.random(),
  })
  readonly description: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
