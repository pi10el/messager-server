import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByName(username);

    if (!user) throw new BadRequestException('Данный логин не зарегистрирован');

    const passIsMatch = await argon2.verify(user.password, password);

    if (user && passIsMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    return {
      token: this.jwtService.sign({ id: user.id, role: user.role }),
    };
  }

  async register(user: CreateUserDto) {
    const userData = (await this.userService.create(user)).user;
    return {
      token: this.jwtService.sign({ id: userData.id, role: userData.role }),
    };
  }
}
