import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createBetterAuth } from './auth.js';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService, logger: Logger) => ({
        auth: createBetterAuth(configService, logger),
      }),
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
