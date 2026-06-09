// src/config/application-client.config.ts

import { Configuration, Value } from '@itgorillaz/configify';
import { StringValue } from 'ms';

@Configuration()
export class ApplicationClientConfig {
  @Value('PORT')
  port: number;

  @Value('DB_HOST')
  host: string;

  @Value('DB_PORT')
  db_port: number;

  @Value('DB_USER')
  username: string;

  @Value('DB_PASSWORD')
  password: string;

  @Value('DB_NAME')
  database: string;

  @Value('JWT_SECRET')
  secret: string;

  @Value('JWT_EXPIRE_ACCESS')
  jwt_expire_access: StringValue;

  @Value('JWT_EXPIRE_REFRESH')
  jwt_expire_refresh: StringValue;
}
