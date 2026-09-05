import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { AuthService, createBetterAuth } from './auth.service.js';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        auth: createBetterAuth(configService),
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, BetterAuthModule],
})
export class AuthModule {}
