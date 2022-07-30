import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../services/auth.service';
import { PayloadToken, RoleEnum } from '../models';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (roles.length === 0) return true;
    // DATA GUARD
    const request = context.switchToHttp().getRequest();
    console.log(request.user, request.refreshToken);
    const user = request.user as PayloadToken;
    // DATA TOKEN
    return this.authService.validateRoleInUser(user, roles);
  }
}
