import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { ConfigType } from '@nestjs/config';

import config from '../../config';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const validate = req.cookies && 'access_token' in req.cookies;
    if (validate) return req.cookies.access_token;
    return null;
  }

  async validate(payload: PayloadToken) {
    return payload;
  }
}
