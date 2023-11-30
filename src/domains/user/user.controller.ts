import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@UserId() id: number) {
    return this.usersService.profile(id);
  }

  @ApiBody({ type: UpdateUserDto })
  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@UserId() id: number, @Body() dto: UpdateUserDto) {
    return this.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@UserId() id: number) {
    return this.usersService.delete(id);
  }

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  deleteAvatar(@UserId() id: number) {
    return this.usersService.deleteAvatar(id);
  }
}
