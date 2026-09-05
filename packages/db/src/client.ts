import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
import dotenv from 'dotenv';

dotenv.config();

let _db: PostgresJsDatabase<typeof schema> | null = null;

export const getDb = (): PostgresJsDatabase<typeof schema> => {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  _db = drizzle(postgres(connectionString, { max: 10 }), { schema });
  return _db;
};

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get: (_, prop) => getDb()[prop as keyof PostgresJsDatabase<typeof schema>],
});
