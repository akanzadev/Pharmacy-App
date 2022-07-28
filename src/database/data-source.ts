import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const dataSource = (): DataSource => {
  if (process.env.NODE_ENV == 'production') {
    return new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
      migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
      entities: [join(__dirname + '/entities/**/*{.ts,.js}')],
      ssl: { rejectUnauthorized: false },
    });
  } else {
    // console.log(join(__dirname, '/migrations/*{.ts,.js}'));
    // console.log(join(__dirname, '/entities/**/*{.ts,.js}'));
    return new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'admin',
      database: 'my_db',
      migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
      entities: [join(__dirname + '/entities/**/*{.ts,.js}')],
      synchronize: false,
      logging: false,
      ssl: false,
    });
  }
};

export const AppDataSource = dataSource();
// npm run migrations:generate -- src/database/migrations/initDB
/* export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  subscribers: [],
});
 */
