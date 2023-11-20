import { diskStorage } from 'multer';

const generateId = () =>
  Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const normalizeFileName = (
  _,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  const fileExtName = file.originalname.split('.').pop();

  callback(null, `${generateId()}${Date.now()}.${fileExtName}`);
};

export const fileStorage = (path: string) =>
  diskStorage({
    destination: `./uploads/${path}`,
    filename: normalizeFileName,
  });
