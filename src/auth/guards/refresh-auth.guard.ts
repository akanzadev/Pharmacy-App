import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../services/auth.service';
import { CookieFields, PayloadToken, RefreshToken } from '../../auth/models';

@Injectable()
export class RefreshAuthGuard extends AuthGuard(['refresh']) {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const oldRequest = context.switchToHttp().getRequest();
    const oldData = oldRequest.user as PayloadToken;
    await super.canActivate(context);
    const newRequest = context.switchToHttp().getRequest();
    const newData = newRequest.user as RefreshToken;
    const { refresh_token: refreshToken } = newRequest.cookies;
    const data: CookieFields = {
      ...oldData,
      ...newData,
      refreshToken,
    };
    const user = await this.authService.validateRefreshToken(data);
    newRequest.user = user;
    if (user) return true;
    return false;
  }
}
