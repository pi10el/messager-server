import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  image: Express.Multer.File;
}
