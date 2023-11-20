import {
  Controller,
  Delete,
  Get,
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly usersService: UserService) {}

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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@UserId() id: number) {
    return this.usersService.delete(id);
  }
}
