import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { StorageService } from './storage.service.js';
import {
  InitiateUploadDto,
  PresignPartDto,
  CompleteUploadDto,
  AbortUploadDto,
  ListFilesQueryDto,
} from './dto/index.js';

@ApiTags('Storage')
@ApiCookieAuth('better-auth.session_token')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/initiate')
  @ApiOperation({ summary: 'Initiate file upload (S3 single presigned PUT or multipart upload)' })
  @ApiResponse({ status: 201, description: 'Upload initiated successfully with upload parameters and presigned URL.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async initiateUpload(
    @Body() dto: InitiateUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.initiateUpload(dto, session.user.id);
  }

  @Post('upload/presign-part')
  @ApiOperation({ summary: 'Generate presigned URL for a specific chunk in multipart upload' })
  @ApiResponse({ status: 201, description: 'Presigned URL generated successfully for chunk.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPresignedPartUrl(
    @Body() dto: PresignPartDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.getPresignedPartUrl(dto, session.user.id);
  }

  @Post('upload/complete')
  @ApiOperation({ summary: 'Finalize file upload and save database record' })
  @ApiResponse({ status: 201, description: 'Upload finalized and file record completed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async completeUpload(
    @Body() dto: CompleteUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.completeUpload(dto, session.user.id);
  }

  @Post('upload/abort')
  @ApiOperation({ summary: 'Abort an active multipart file upload' })
  @ApiResponse({ status: 201, description: 'Multipart upload aborted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async abortUpload(
    @Body() dto: AbortUploadDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.abortUpload(dto, session.user.id);
  }

  @Get('upload/parts')
  @ApiOperation({ summary: 'List already uploaded parts for an in-progress multipart upload' })
  @ApiQuery({ name: 'fileId', required: true, type: String })
  @ApiQuery({ name: 'uploadId', required: true, type: String })
  @ApiQuery({ name: 'key', required: true, type: String })
  @ApiResponse({ status: 200, description: 'List of completed parts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async listUploadedParts(
    @Query('fileId') fileId: string,
    @Query('uploadId') uploadId: string,
    @Query('key') key: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.listUploadedParts(fileId, uploadId, key, session.user.id);
  }

  @Get('files')
  @ApiOperation({ summary: 'List user uploaded files with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of files.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async listFiles(
    @Query() query: ListFilesQueryDto,
    @Session() session: UserSession,
  ) {
    return this.storageService.listFiles(session.user.id, query);
  }

  @Get('files/:id/download')
  @ApiOperation({ summary: 'Get temporary presigned download URL for a file' })
  @ApiParam({ name: 'id', description: 'File UUID', type: String })
  @ApiResponse({ status: 200, description: 'Presigned download URL generated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 44, description: 'File not found.' })
  async getDownloadUrl(
    @Param('id') fileId: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.getPresignedDownloadUrl(fileId, session.user.id);
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete a file from S3 and database' })
  @ApiParam({ name: 'id', description: 'File UUID', type: String })
  @ApiResponse({ status: 200, description: 'File deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async deleteFile(
    @Param('id') fileId: string,
    @Session() session: UserSession,
  ) {
    return this.storageService.deleteFile(fileId, session.user.id);
  }
}
