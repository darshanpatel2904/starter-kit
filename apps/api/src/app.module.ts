import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';

import {
  envValidationSchema,
  appConfig,
  databaseConfig,
  authConfig,
  storageConfig,
} from './lib/config/index.js';
import { AuthModule } from './auth/auth.module.js';
import { StorageModule } from './storage/storage.module.js';

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
      load: [appConfig, databaseConfig, authConfig, storageConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const short = configService.get<{ ttl: number; limit: number }>(
          'app.throttler.short',
          { ttl: 10000, limit: 10 },
        );
        const medium = configService.get<{ ttl: number; limit: number }>(
          'app.throttler.medium',
          { ttl: 60000, limit: 100 },
        );
        return {
          throttlers: [
            {
              name: 'short',
              ttl: short.ttl,
              limit: short.limit,
            },
            {
              name: 'medium',
              ttl: medium.ttl,
              limit: medium.limit,
            },
          ],
        };
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
