import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres123',
  password: 'postgres123!',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};