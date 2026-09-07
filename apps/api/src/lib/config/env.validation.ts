import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required in apps/api/.env',
  }),
  BETTER_AUTH_SECRET: Joi.string().required().messages({
    'any.required': 'BETTER_AUTH_SECRET is required in apps/api/.env',
  }),
  APP_URL: Joi.string().uri().default('http://localhost:3000'),
  CORS_ORIGIN: Joi.string().allow('').optional(),
  THROTTLER_TTL_SHORT: Joi.number().default(10000),
  THROTTLER_LIMIT_SHORT: Joi.number().default(10),
  THROTTLER_TTL_MEDIUM: Joi.number().default(60000),
  THROTTLER_LIMIT_MEDIUM: Joi.number().default(100),
  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
  AWS_REGION: Joi.string().required().default('us-east-1'),
  AWS_S3_BUCKET: Joi.string().required().messages({
    'any.required': 'AWS_S3_BUCKET is required in apps/api/.env',
  }),
  AWS_ACCESS_KEY_ID: Joi.string().required().messages({
    'any.required': 'AWS_ACCESS_KEY_ID is required in apps/api/.env',
  }),
  AWS_SECRET_ACCESS_KEY: Joi.string().required().messages({
    'any.required': 'AWS_SECRET_ACCESS_KEY is required in apps/api/.env',
  }),
  AWS_S3_ENDPOINT: Joi.string().allow('').optional(),
  AWS_S3_FORCE_PATH_STYLE: Joi.boolean().default(false),
});
