import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const dataSource = (): DataSource => {
  if (process.env.NODE_ENV === 'production') {
    return new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    return new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'admin',
      database: 'my_db',
      migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
      entities: [__dirname + '/../**/entities/*{.ts,.js}'],
      synchronize: false,
      logging: false,
      ssl: false,
    });
  }
};

export const AppDataSource = dataSource();

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
