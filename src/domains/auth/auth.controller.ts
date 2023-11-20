import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
