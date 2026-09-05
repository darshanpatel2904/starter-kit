import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller.js';
import { StorageService } from './storage.service.js';
import { StorageRepository } from './storage.repository.js';

@Module({
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
  exports: [StorageService, StorageRepository],
})
export class StorageModule {}
