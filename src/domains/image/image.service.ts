import { Injectable } from '@nestjs/common';
import { getPlaiceholder } from 'plaiceholder';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  async upload(image: Express.Multer.File) {
    const { base64 } = await getPlaiceholder(`/../${image.path}`);

    return {
      src: image.path,
      blur: base64,
    };
  }

  delete(src: string) {
    fs.unlinkSync(
      path.join(__dirname, '../../..', src.replace(/[\s\S]*?(?=uploads)/, '')),
    );
  }
}
