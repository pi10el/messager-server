import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { fileStorage } from '../image/storage';
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

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', { storage: fileStorage('avatars') }),
  )
  @ApiBody({ type: UploadAvatarDto })
  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  uploadAvatar(
    @UploadedFile() image: Express.Multer.File,
    @UserId() id: number,
  ) {
    return this.usersService.uploadAvatar(id, image);
  }

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  deleteAvatar(@UserId() id: number) {
    return this.usersService.deleteAvatar(id);
  }
}
