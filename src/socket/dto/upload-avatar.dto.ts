import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  ext: string;

  @ApiProperty()
  @IsNotEmpty()
  image: Buffer;
}
