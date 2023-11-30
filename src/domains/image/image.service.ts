import { generateUniqueString } from 'src/common/utils/generateUniqueString';
import { UploadAvatarDto } from 'src/socket/dto/upload-avatar.dto';
import { Injectable } from '@nestjs/common';
import { getPlaiceholder } from 'plaiceholder';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  async upload(data: UploadAvatarDto) {
    const { base64 } = await getPlaiceholder(data.image);

    const filePath = `uploads/${generateUniqueString()}.${data.ext}`;
    const writePath = path.join(__dirname, '../../../', filePath);

    fs.writeFileSync(writePath, data.image);

    return {
      src: filePath,
      blur: base64,
    };
  }

  delete(src: string) {
    fs.unlinkSync(
      path.join(__dirname, '../../..', src.replace(/[\s\S]*?(?=uploads)/, '')),
    );
  }
}
