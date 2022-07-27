import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

export const multerOptions: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 5242880, // 5MB
    files: 1,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: CallableFunction,
  ) => {
    if (
      !file.mimetype.match(/^image\/(gif|jpe?g|png)$/) &&
      // FOR FLUUTER APLICATION
      !file.mimetype.match(/^application\/(octet-stream)$/)
    ) {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    } else {
      cb(null, true);
    }
  },
  // Storage properties
  storage: memoryStorage(),
};
