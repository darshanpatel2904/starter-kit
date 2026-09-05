import { fetcher } from './api-client';
import type {
  InitiateUploadResponse,
  PresignPartResponse,
  CompletedPart,
  FileRecord,
} from '@repo/types';

export interface CustomUploadOptions {
  file: File;
  onProgress?: (percent: number) => void;
  onSuccess?: (fileRecord: FileRecord) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

const DEFAULT_CONCURRENCY = 3;

interface XhrUploadParams {
  url: string;
  body: Blob | File;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (loaded: number) => void;
}

/**
 * Reusable XHR PUT helper for S3 presigned URL upload with progress tracking.
 */
function uploadChunkViaXhr(params: XhrUploadParams): Promise<string | null> {
  const { url, body, contentType, signal, onProgress } = params;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (signal) {
      const onAbort = () => {
        xhr.abort();
        reject(new Error('Upload aborted by user'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(e.loaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let eHeader = xhr.getResponseHeader('ETag');
        if (eHeader) {
          eHeader = eHeader.replace(/"/g, ''); // strip quotes
        }
        resolve(eHeader);
      } else {
        reject(new Error(`S3 upload failed with HTTP status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during S3 upload'));
    xhr.onabort = () => reject(new Error('Upload aborted by user'));

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(body);
  });
}

/**
 * S3 Multipart Upload Client Engine.
 * Direct Browser-to-S3 upload via presigned URLs with chunking & parallel uploads.
 */
export async function uploadFileToS3(options: CustomUploadOptions): Promise<FileRecord | null> {
  const { file, onProgress, onSuccess, onError, signal } = options;

  try {
    // 1. Initiate Upload in Backend
    const initiateRes = await fetcher<InitiateUploadResponse>('/storage/upload/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
      }),
    });

    if (!initiateRes) {
      throw new Error('Failed to initiate upload with backend server.');
    }

    const { fileId, key, isMultipart, uploadId, uploadUrl, chunkSize = 5 * 1024 * 1024, totalParts = 1 } = initiateRes;

    // --- CASE 1: Single presigned PUT (Files <= 10MB) ---
    if (!isMultipart && uploadUrl) {
      await uploadChunkViaXhr({
        url: uploadUrl,
        body: file,
        contentType: file.type || 'application/octet-stream',
        signal,
        onProgress: (loaded) => {
          const percent = Math.min(99, Math.round((loaded / file.size) * 100));
          onProgress?.(percent);
        },
      });

      // Complete in backend
      const completeRes = await fetcher<FileRecord>('/storage/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, key }),
      });

      if (!completeRes) {
        throw new Error('Failed to complete file record in database.');
      }

      onProgress?.(100);
      onSuccess?.(completeRes);
      return completeRes;
    }

    // --- CASE 2: S3 Multipart Upload (Files > 10MB) ---
    if (!uploadId) {
      throw new Error('Missing S3 UploadId for multipart upload.');
    }

    const completedParts: CompletedPart[] = [];
    const partTasks: { partNumber: number; start: number; end: number }[] = [];

    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      partTasks.push({ partNumber, start, end });
    }

    let taskIndex = 0;
    const activePartProgress: Record<number, number> = {};

    const uploadWorker = async (): Promise<void> => {
      while (taskIndex < partTasks.length) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }

        const task = partTasks[taskIndex++];
        if (!task) break;
        const chunkBlob = file.slice(task.start, task.end);

        // 1. Fetch presigned part URL from API
        const presignRes = await fetcher<PresignPartResponse>('/storage/upload/presign-part', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId,
            uploadId,
            key,
            partNumber: task.partNumber,
          }),
        });

        if (!presignRes?.presignedUrl) {
          throw new Error(`Failed to get presigned URL for part #${task.partNumber}`);
        }

        // 2. Upload chunk via helper
        const etag = await uploadChunkViaXhr({
          url: presignRes.presignedUrl,
          body: chunkBlob,
          contentType: 'application/octet-stream',
          signal,
          onProgress: (loaded) => {
            activePartProgress[task.partNumber] = loaded;
            const currentTotalUploaded = Object.values(activePartProgress).reduce((acc, cur) => acc + cur, 0);
            const percent = Math.min(99, Math.round((currentTotalUploaded / file.size) * 100));
            onProgress?.(percent);
          },
        });

        if (!etag) {
          throw new Error(`Missing ETag header for part #${task.partNumber}. Check S3 CORS settings.`);
        }

        completedParts.push({ ETag: etag, PartNumber: task.partNumber });
        activePartProgress[task.partNumber] = task.end - task.start;
      }
    };

    // Run worker pool
    const workers = Array.from({ length: Math.min(DEFAULT_CONCURRENCY, partTasks.length) }, () => uploadWorker());
    await Promise.all(workers);

    // Sort parts by PartNumber
    completedParts.sort((a, b) => a.PartNumber - b.PartNumber);

    // 3. Complete Multipart Upload in Backend
    const completeRes = await fetcher<FileRecord>('/storage/upload/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId,
        uploadId,
        key,
        parts: completedParts,
      }),
    });

    if (!completeRes) {
      throw new Error('Failed to finalize multipart upload in backend database.');
    }

    onProgress?.(100);
    onSuccess?.(completeRes);
    return completeRes;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError?.(error);
    throw error;
  }
}
