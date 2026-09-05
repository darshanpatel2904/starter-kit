import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  type S3ClientConfig,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ListPartsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { StorageRepository } from './storage.repository.js';
import type {
  InitiateUploadDto,
  PresignPartDto,
  CompleteUploadDto,
  AbortUploadDto,
  ListFilesQueryDto,
} from './dto/index.js';
import type {
  InitiateUploadResponse,
  PresignPartResponse,
  PaginatedFilesResponse,
} from '@repo/types';

const MULTIPART_THRESHOLD = 10 * 1024 * 1024; // 10MB
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly storageRepository: StorageRepository,
  ) {
    const region = this.configService.getOrThrow<string>('storage.region');
    const accessKeyId = this.configService.getOrThrow<string>(
      'storage.accessKeyId',
    );
    const secretAccessKey = this.configService.getOrThrow<string>(
      'storage.secretAccessKey',
    );
    const endpoint = this.configService.get<string>('storage.endpoint');
    const forcePathStyle = this.configService.get<boolean>(
      'storage.forcePathStyle',
      false,
    );

    this.bucket = this.configService.getOrThrow<string>('storage.bucket');

    const clientConfig: S3ClientConfig = {
      region,
      forcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    if (endpoint) {
      clientConfig.endpoint = endpoint;
    }

    this.s3Client = new S3Client(clientConfig);
  }

  /**
   * Initiate upload: Single PUT presigned URL if <= 10MB, else Multipart Upload.
   */
  async initiateUpload(
    dto: InitiateUploadDto,
    uploaderId: string,
  ): Promise<InitiateUploadResponse> {
    const fileId = randomUUID();
    const sanitizedFileName = dto.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const key = `uploads/${uploaderId}/${fileId}/${sanitizedFileName}`;
    const isMultipart = dto.fileSize > MULTIPART_THRESHOLD;

    if (!isMultipart) {
      // Single Presigned PUT URL
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: dto.mimeType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 900,
      });

      // Create record in database via repository
      await this.storageRepository.createFileRecord({
        id: fileId,
        name: dto.fileName,
        key,
        mimeType: dto.mimeType,
        size: dto.fileSize,
        status: 'PENDING',
        uploaderId,
      });

      return {
        fileId,
        key,
        isMultipart: false,
        uploadUrl,
      };
    }

    // Multipart Upload initialization
    const createMultipartCommand = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.mimeType,
    });

    const multipartRes = await this.s3Client.send(createMultipartCommand);
    const uploadId = multipartRes.UploadId;

    if (!uploadId) {
      throw new BadRequestException('Failed to initiate S3 multipart upload.');
    }

    // Save PENDING record in DB via repository
    await this.storageRepository.createFileRecord({
      id: fileId,
      name: dto.fileName,
      key,
      mimeType: dto.mimeType,
      size: dto.fileSize,
      status: 'PENDING',
      uploadId,
      uploaderId,
    });

    const chunkSize = DEFAULT_CHUNK_SIZE;
    const totalParts = Math.ceil(dto.fileSize / chunkSize);

    return {
      fileId,
      key,
      isMultipart: true,
      uploadId,
      chunkSize,
      totalParts,
    };
  }

  /**
   * Get presigned URL for a specific multipart chunk.
   */
  async getPresignedPartUrl(
    dto: PresignPartDto,
    uploaderId: string,
  ): Promise<PresignPartResponse> {
    await this.verifyFileOwnership(dto.fileId, uploaderId);

    const command = new UploadPartCommand({
      Bucket: this.bucket,
      Key: dto.key,
      UploadId: dto.uploadId,
      PartNumber: dto.partNumber,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
    });

    return {
      presignedUrl,
      partNumber: dto.partNumber,
    };
  }

  /**
   * Complete upload: Calls CompleteMultipartUpload (if multipart) and marks status COMPLETED.
   */
  async completeUpload(dto: CompleteUploadDto, uploaderId: string) {
    await this.verifyFileOwnership(dto.fileId, uploaderId);

    if (dto.uploadId && dto.parts && dto.parts.length > 0) {
      const sortedParts = [...dto.parts].sort(
        (a, b) => a.PartNumber - b.PartNumber,
      );

      const command = new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: dto.key,
        UploadId: dto.uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });

      await this.s3Client.send(command);
    }

    // Mark COMPLETED in DB via repository
    return await this.storageRepository.updateFileStatus(
      dto.fileId,
      'COMPLETED',
    );
  }

  /**
   * Abort upload: Aborts S3 multipart upload and updates DB status to ABORTED.
   */
  async abortUpload(dto: AbortUploadDto, uploaderId: string) {
    await this.verifyFileOwnership(dto.fileId, uploaderId);

    if (dto.uploadId) {
      try {
        const command = new AbortMultipartUploadCommand({
          Bucket: this.bucket,
          Key: dto.key,
          UploadId: dto.uploadId,
        });
        await this.s3Client.send(command);
      } catch (error) {
        this.logger.warn(
          `Failed to abort S3 upload for ${dto.uploadId}: ${error}`,
        );
      }
    }

    return await this.storageRepository.updateFileStatus(dto.fileId, 'ABORTED');
  }

  /**
   * List parts already uploaded to S3 (for pause/resume upload state recovery).
   */
  async listUploadedParts(
    fileId: string,
    uploadId: string,
    key: string,
    uploaderId: string,
  ) {
    await this.verifyFileOwnership(fileId, uploaderId);

    try {
      const command = new ListPartsCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: uploadId,
      });

      const res = await this.s3Client.send(command);
      return res.Parts || [];
    } catch (error) {
      this.logger.warn(`ListParts failed for uploadId ${uploadId}: ${error}`);
      return [];
    }
  }

  /**
   * Get presigned GET URL to download a file.
   */
  async getPresignedDownloadUrl(fileId: string, uploaderId: string) {
    const fileRecord = await this.verifyFileOwnership(fileId, uploaderId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileRecord.key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(fileRecord.name)}"`,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    return { downloadUrl, file: fileRecord };
  }

  /**
   * List files for current user with pagination.
   */
  async listFiles(
    uploaderId: string,
    query: ListFilesQueryDto,
  ): Promise<PaginatedFilesResponse> {
    return await this.storageRepository.listFilesByUploader(uploaderId, {
      page: query.page || 1,
      limit: query.limit || 10,
    });
  }

  /**
   * Delete a file from S3 and DB.
   */
  async deleteFile(fileId: string, uploaderId: string) {
    const fileRecord = await this.verifyFileOwnership(fileId, uploaderId);

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileRecord.key,
      });
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.warn(`S3 delete failed for key ${fileRecord.key}: ${error}`);
    }

    await this.storageRepository.deleteFileRecord(fileId);
    return { success: true };
  }

  /**
   * Helper: Verify user owns the file.
   */
  private async verifyFileOwnership(fileId: string, uploaderId: string) {
    const fileRecord = await this.storageRepository.findFileById(fileId);

    if (!fileRecord) {
      throw new NotFoundException('File record not found.');
    }

    if (fileRecord.uploaderId !== uploaderId) {
      throw new ForbiddenException('Access denied to this file.');
    }

    return fileRecord;
  }
}
