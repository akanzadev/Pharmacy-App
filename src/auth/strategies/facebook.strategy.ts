import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Strategy, Profile } from 'passport-facebook';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos';
import { SourceEnum, RoleEnum } from '../models';
import { User, Role, Source, Customer } from '../../database/entities/users';
import config from '../../config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Source) private sourceRepo: Repository<Source>,
  ) {
    super({
      clientID: configService.facebook.clientID,
      clientSecret: configService.facebook.clientSecret,
      callbackURL: configService.facebook.callbackURL,
      scope: 'email',
      profileFields: ['id', 'displayName', 'emails', 'first_name', 'last_name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    const userExist = await this.authService.validateEmail(
      profile.emails[0].value,
    );
    if (userExist) return done(null, userExist);
    const data: CreateUserDto = {
      email: profile.emails[0].value,
      password: profile.emails[0].value,
      lastname: profile.name.familyName,
      name: profile.name.givenName,
      phone: '',
    };
    const user = await this.createGoogleUser(data);
    done(null, user);
  }

  async createGoogleUser(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    newUser.customer = await this.customerRepo.save(
      this.customerRepo.create({
        name: data.name,
        lastname: data.lastname,
      }),
    );
    newUser.role = await this.roleRepo.findOne({
      where: { name: RoleEnum.CUSTOMER },
    });
    newUser.source = await this.sourceRepo.findOne({
      where: { name: SourceEnum.GOOGLE },
    });
    const rta = await this.userRepo.save(newUser);
    const customer = await this.customerRepo.findOneBy({ id: rta.customer.id });
    customer.user = rta;
    await this.customerRepo.save(customer);
    return rta;
  }
}
