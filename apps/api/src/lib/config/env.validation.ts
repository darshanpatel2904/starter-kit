import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .messages({
      'any.required': 'NODE_ENV is required in apps/api/.env',
    }),
  PORT: Joi.number().required().messages({
    'any.required': 'PORT is required in apps/api/.env',
  }),
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required in apps/api/.env',
  }),
  BETTER_AUTH_SECRET: Joi.string().required().messages({
    'any.required': 'BETTER_AUTH_SECRET is required in apps/api/.env',
  }),
  APP_URL: Joi.string().uri().required().messages({
    'any.required': 'APP_URL is required in apps/api/.env',
  }),
  CORS_ORIGIN: Joi.string().allow('').required().messages({
    'any.required': 'CORS_ORIGIN is required in apps/api/.env',
  }),
  THROTTLER_TTL_SHORT: Joi.number().required().messages({
    'any.required': 'THROTTLER_TTL_SHORT is required in apps/api/.env',
  }),
  THROTTLER_LIMIT_SHORT: Joi.number().required().messages({
    'any.required': 'THROTTLER_LIMIT_SHORT is required in apps/api/.env',
  }),
  THROTTLER_TTL_MEDIUM: Joi.number().required().messages({
    'any.required': 'THROTTLER_TTL_MEDIUM is required in apps/api/.env',
  }),
  THROTTLER_LIMIT_MEDIUM: Joi.number().required().messages({
    'any.required': 'THROTTLER_LIMIT_MEDIUM is required in apps/api/.env',
  }),
  GOOGLE_CLIENT_ID: Joi.string().allow('').required().messages({
    'any.required': 'GOOGLE_CLIENT_ID is required in apps/api/.env',
  }),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').required().messages({
    'any.required': 'GOOGLE_CLIENT_SECRET is required in apps/api/.env',
  }),
  AWS_REGION: Joi.string().required().messages({
    'any.required': 'AWS_REGION is required in apps/api/.env',
  }),
  AWS_S3_BUCKET: Joi.string().required().messages({
    'any.required': 'AWS_S3_BUCKET is required in apps/api/.env',
  }),
  AWS_ACCESS_KEY_ID: Joi.string().required().messages({
    'any.required': 'AWS_ACCESS_KEY_ID is required in apps/api/.env',
  }),
  AWS_SECRET_ACCESS_KEY: Joi.string().required().messages({
    'any.required': 'AWS_SECRET_ACCESS_KEY is required in apps/api/.env',
  }),
});
