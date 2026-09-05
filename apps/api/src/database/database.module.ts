import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database-connection.js';
import { db } from '@repo/db';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        return db;
      },
    },
  ],
})
export class DatabaseModule {}
