import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/database/prisma.service';
import { ImageService } from '../image/image.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ImageService],
  exports: [UserService],
})
export class UserModule {}
