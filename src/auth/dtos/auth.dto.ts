import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginAuthDto {
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
