import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!, 10),
  appUrl: process.env.APP_URL!,
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [process.env.APP_URL!],
  throttler: {
    short: {
      ttl: parseInt(process.env.THROTTLER_TTL_SHORT!, 10),
      limit: parseInt(process.env.THROTTLER_LIMIT_SHORT!, 10),
    },
    medium: {
      ttl: parseInt(process.env.THROTTLER_TTL_MEDIUM!, 10),
      limit: parseInt(process.env.THROTTLER_LIMIT_MEDIUM!, 10),
    },
  },
}));
