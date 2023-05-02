import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

console.log(process.env.username);
console.log(process.env.PASSWORD_DEV);

const developmentConfig: ConnectionOptions = {
  type: 'mysql',
  port: 3306,
  host: process.env.DB_HOST_DEV,
  username: 'root',
  password: '123456',
  database: process.env.DB_DATABASE_DEV,
  //自动收集 ".entity.ts" 后缀的文件，自动化收集所有实体类，快速建表。
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  logging: false,
  synchronize: true,
};

const productionConfig: ConnectionOptions = {
  type: 'mysql',
  port: 3306,
  host: process.env.DB_HOST_PRO,
  username: 'root',
  password: '123456',
  database: process.env.DB_DATABASE_PRO,
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  logging: false,
  synchronize: true,
};

const config: ConnectionOptions =
  process.env.NODE_ENV == 'production' ? productionConfig : developmentConfig;

export default config;
