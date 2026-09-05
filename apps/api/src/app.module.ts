import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';

import {
  envValidationSchema,
  appConfig,
  databaseConfig,
  authConfig,
} from './lib/config/index.js';
import { AuthModule } from './auth/auth.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: (config: Record<string, unknown>) => {
        const { error, value } = envValidationSchema.validate(config, {
          allowUnknown: true,
          abortEarly: true,
        });
        if (error) {
          throw new Error(`Environment validation error: ${error.message}`);
        }
        return value;
      },
      load: [appConfig, databaseConfig, authConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

