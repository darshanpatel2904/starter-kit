import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { passkey } from '@better-auth/passkey';
import { db, type Database } from '@repo/db';

export type AuthInstance = ReturnType<typeof betterAuth>;

export function createBetterAuth(
  configService: ConfigService,
  dbConnection: Database = db,
  logger: Logger,
): AuthInstance {
  const corsOrigins = configService.getOrThrow<string[]>('app.corsOrigins');
  const googleClientId = configService.getOrThrow<string>(
    'auth.googleClientId',
  );
  const googleClientSecret = configService.getOrThrow<string>(
    'auth.googleClientSecret',
  );
  const authBaseUrl = configService.getOrThrow<string>('auth.appUrl');

  return betterAuth({
    database: drizzleAdapter(dbConnection, {
      provider: 'pg',
      usePlural: true,
    }),
    trustedOrigins: corsOrigins,
    secret: configService.get<string>('auth.secret'),
    baseURL: authBaseUrl,
    logger,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        enabled: Boolean(googleClientId),
      },
    },
    plugins: [passkey()],
  }) as unknown as AuthInstance;
}
