import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { ImageService } from '../image/image.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  async findByName(username: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async profile(id: number) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        about: true,
        email: true,
        username: true,
        role: true,
        avatar: {
          select: { src: true, blur: true },
        },
      },
    });

    return profile;
  }

  async create(dto: CreateUserDto) {
    const isExistName = await this.prisma.user.findUnique({
      where: { username: dto.username.toLowerCase() },
    });

    const isExistEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (isExistName)
      throw new BadRequestException('Данный логин уже зарегестрирован');

    if (isExistEmail)
      throw new BadRequestException('Данный Email уже зарегестрирован');

    const role = dto.username === 'admin' ? 'admin' : 'user';

    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...dto,
        role,
        password: await argon2.hash(dto.password),
      },
    });

    return { user };
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: { ...dto } });
  }

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const isExist = await this.prisma.avatar.findFirst({
      where: { userId: id },
    });

    if (isExist) {
      this.imageService.delete(isExist.src);
    }

    const image = await this.imageService.upload(file);

    return this.prisma.user.update({
      where: { id },
      data: {
        avatar: {
          upsert: {
            update: { ...image },
            create: { ...image },
          },
        },
      },
    });
  }

  async deleteAvatar(id: number) {
    const isExist = await this.prisma.avatar.findFirst({
      where: { userId: id },
    });

    if (!isExist)
      throw new BadRequestException('У вас нет фото которое можно удалить');

    this.imageService.delete(isExist.src);

    await this.prisma.avatar.delete({ where: { userId: id } });
  }

  async delete(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}
