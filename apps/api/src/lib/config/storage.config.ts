import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  region: process.env.AWS_REGION!,
  bucket: process.env.AWS_S3_BUCKET!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
}));
