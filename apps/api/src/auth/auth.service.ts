import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { passkey } from '@better-auth/passkey';
import { db } from '@repo/db';

export type AuthInstance = ReturnType<typeof betterAuth>;

export function createBetterAuth(
  configService: ConfigService,
  logger?: Logger,
): AuthInstance {
  // Return betterAuth instance cast to AuthInstance to prevent TypeScript portable declaration errors (TS2883)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),
    secret: configService.get<string>('auth.secret'),
    baseURL: configService.get<string>('auth.appUrl'),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user }) => {
        logger?.log(`Password reset requested for ${user.email}`);
      },
    },
    socialProviders: {
      google: {
        clientId: configService.get<string>('auth.googleClientId') || '',
        clientSecret:
          configService.get<string>('auth.googleClientSecret') || '',
        enabled: Boolean(configService.get<string>('auth.googleClientId')),
      },
    },
    plugins: [passkey()],
  }) as unknown as AuthInstance;
}

@Injectable()
export class AuthService {
  public readonly auth: AuthInstance;
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {
    this.auth = createBetterAuth(this.configService, this.logger);
  }
}
