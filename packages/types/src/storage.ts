import type { PaginatedResponse } from './pagination.js';

export interface InitiateUploadResponse {
  fileId: string;
  key: string;
  isMultipart: boolean;
  uploadId?: string;
  uploadUrl?: string; // For single presigned PUT (when isMultipart = false)
  chunkSize?: number; // e.g. 5MB (5 * 1024 * 1024)
  totalParts?: number;
}

export interface PresignPartResponse {
  presignedUrl: string;
  partNumber: number;
}

export interface CompletedPart {
  ETag: string;
  PartNumber: number;
}

export interface FileRecord {
  id: string;
  name: string;
  key: string;
  mimeType: string;
  size: number;
  status: 'PENDING' | 'COMPLETED' | 'ABORTED';
  uploadId?: string | null;
  uploaderId: string;
  downloadUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type PaginatedFilesResponse = PaginatedResponse<FileRecord>;
