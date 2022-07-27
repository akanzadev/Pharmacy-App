import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    scope: {
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    postgres: {
      dbName: process.env.PG_DB,
      host: process.env.PG_HOST,
      password: process.env.PG_PASSWORD,
      port: parseInt(process.env.PG_PORT, 10),
      user: process.env.PG_USER,
      url: process.env.DATABASE_URL,
    },
    jwt: {
      expiration: process.env.ACCESS_TOKEN_EXPIRATION,
      refreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      refreshSecret: process.env.REFRESH_TOKEN_SECRET,
      secret: process.env.ACCESS_TOKEN_SECRET,
    },
    facebook: {
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    storage: {
      cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
    },
  };
});
