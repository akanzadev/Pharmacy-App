import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { PayloadToken, RoleEnum } from './../models';
import { User, Role } from '../../database/entities/users';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log(email, password);
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async generateJwtToken(userData: User) {
    const role = await this.rolesRepo.findOne({
      where: { id: userData.role.id },
    });
    const user = await this.validateEmail(userData.email);
    delete user.role;
    if (!role) throw new UnauthorizedException('Invalid credentials');
    const payload: PayloadToken = { role: role.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
    if (user) return user;
    return null;
  }

  async validateRoleInUser(user: PayloadToken, roles: RoleEnum[]) {
    const userRole = await this.userRepo.findOne(user.sub, {
      relations: ['role'],
    });
    if (!userRole) throw new UnauthorizedException('Invalid credentials');
    const role = userRole.role.name;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('Your role is wrong');
    }
    return true;
  }
}
