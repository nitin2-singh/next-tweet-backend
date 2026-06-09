import 'dotenv/config';
import { DataSource } from 'typeorm';

console.log('HOST', process.env.DB_HOST);
console.log('USER', process.env.DB_USER);
console.log('DB', process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
});

console.log('AppDataSource', AppDataSource.entityMetadatas);
