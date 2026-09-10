import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createBetterAuth } from './auth.js';
import { DATABASE, type Database } from '@repo/db';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, DATABASE],
      useFactory: (configService: ConfigService, db: Database) => {
        const logger = new Logger('BetterAuth');
        return {
          auth: createBetterAuth(configService, db, logger),
        };
      },
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
