import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { LoginAuthDto } from '../dtos/auth.dto';
import { User } from '../../database/entities/users';
import { RefreshAuthGuard } from '../guards/refresh-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginAuthDto })
  login(@Req() req: Request) {
    return this.authService.generateJwtToken(req.user as User);
  }

  @Post('refreshToken')
  @UseGuards(JwtAuthGuard, RefreshAuthGuard)
  refreshToken(@Req() req: Request) {
    return this.authService.generateJwtToken(req.user as User);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallBack(@Req() req: Request) {
    return this.authService.generateJwtToken(req.user as User);
  }
}
