import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

type resource = 'pharmacies' | 'products' | 'users';

@Injectable()
export class ImagesService {
  async uploadImage(
    identifier,
    file: Express.Multer.File,
    type: resource,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `medic-app/${type}`,
          public_id: `${identifier}-${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async updateImage(
    identifier: string,
    imageURL: string,
    file: Express.Multer.File,
    type: resource,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const imageId = imageURL.split('/').pop().split('.')[0];
      /* const lastName = imageURL.split('/').pop().split('.')[0].split('-')[0];
      identifier = identifier ? identifier : lastName; */
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `medic-app/${type}`,
          public_id: imageId,
          overwrite: true,
          resource_type: 'image',
          version: imageId,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
          // rename the file to the new name
          /* cloudinary.uploader.rename(
            `${imageId}`,
            `${identifier}-${Date.now()}`,
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          ); */
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
