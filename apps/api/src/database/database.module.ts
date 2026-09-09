import { Global, Module } from '@nestjs/common';
import { databaseProvider } from '@repo/db';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
