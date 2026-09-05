import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: createEnv({
    client: {
      NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
    },
    experimental__runtimeEnv: {
      NEXT_PUBLIC_API_URL: globalThis.process?.env?.NEXT_PUBLIC_API_URL,
    },
  }),
};

export default nextConfig;
