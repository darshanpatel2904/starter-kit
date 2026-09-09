import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
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
    DatabaseModule,
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
        const short = configService.getOrThrow<{ ttl: number; limit: number }>(
          'app.throttler.short',
        );
        const medium = configService.getOrThrow<{ ttl: number; limit: number }>(
          'app.throttler.medium',
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
    UsersModule,
    AuthModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
