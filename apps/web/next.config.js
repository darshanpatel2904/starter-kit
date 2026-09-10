import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@repo/types'],
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
      },
    ];
  },
  env: createEnv({
    client: {
      NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
    },
    experimental__runtimeEnv: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
  }),
};

export default nextConfig;
