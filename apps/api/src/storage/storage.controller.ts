import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { StorageService } from './storage.service.js';
import {
  InitiateUploadDto,
  PresignPartDto,
  CompleteUploadDto,
  AbortUploadDto,
  ListFilesQueryDto,
} from './dto/index.js';

@Controller('storage')
@UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/initiate')
  async initiateUpload(
    @Body() dto: InitiateUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.initiateUpload(dto, session.user.id);
  }

  @Post('upload/presign-part')
  async getPresignedPartUrl(
    @Body() dto: PresignPartDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.getPresignedPartUrl(dto, session.user.id);
  }

  @Post('upload/complete')
  async completeUpload(
    @Body() dto: CompleteUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.completeUpload(dto, session.user.id);
  }

  @Post('upload/abort')
  async abortUpload(
    @Body() dto: AbortUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.abortUpload(dto, session.user.id);
  }

  @Get('upload/parts')
  async listUploadedParts(
    @Query('fileId') fileId: string,
    @Query('uploadId') uploadId: string,
    @Query('key') key: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.listUploadedParts(fileId, uploadId, key, session.user.id);
  }

  @Get('files')
  async listFiles(
    @Query() query: ListFilesQueryDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.listFiles(session.user.id, query);
  }

  @Get('files/:id/download')
  async getDownloadUrl(
    @Param('id') fileId: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.getPresignedDownloadUrl(fileId, session.user.id);
  }

  @Delete('files/:id')
  async deleteFile(
    @Param('id') fileId: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.deleteFile(fileId, session.user.id);
  }
}
