import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { ImagesService } from './services/images.service';
import config from '../config';

@Module({
  providers: [
    ImagesService,
    {
      provide: 'Cloudinary',
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { api_key, api_secret, cloud_name } =
          configService.storage.cloudinary;
        return cloudinary.config({
          cloud_name,
          api_key,
          api_secret,
        });
      },
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
