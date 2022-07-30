import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { ConfigType } from '@nestjs/config';

import config from '../../config';
import { RefreshToken } from '../models/token.model';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractRefreshToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }

  private static extractRefreshToken(req: RequestType): string | null {
    const validate = req.cookies && 'refresh_token' in req.cookies;
    if (validate) return req.cookies.refresh_token;
    return null;
  }

  async validate(payload: RefreshToken) {
    return payload;
  }
}
