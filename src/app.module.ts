import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './common/helpers/environments';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(`${__dirname}/common/envs`),
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000).required(),
        PG_USER: Joi.string(),
        PG_PASSWORD: Joi.string(),
        PG_HOST: Joi.string().hostname(),
        PG_PORT: Joi.number(),
        PG_DB: Joi.string(),
        DATABASE_URL: Joi.string(),
        NODE_ENV: Joi.string().valid('development', 'production'),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
    ImagesModule,
  ],
})
export class AppModule {}
