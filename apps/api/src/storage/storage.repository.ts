import { Injectable } from '@nestjs/common';
import { db, files, eq, and, desc, sql, type FileRecord, type NewFileRecord } from '@repo/db';

@Injectable()
export class StorageRepository {
  async createFileRecord(data: NewFileRecord): Promise<FileRecord> {
    const [inserted] = await db.insert(files).values(data).returning();
    if (!inserted) {
      throw new Error('Failed to insert file record into database.');
    }
    return inserted;
  }


  async updateFileStatus(fileId: string, status: 'COMPLETED' | 'ABORTED'): Promise<FileRecord | undefined> {
    const [updated] = await db
      .update(files)
      .set({ status, updatedAt: new Date() })
      .where(eq(files.id, fileId))
      .returning();
    return updated;
  }

  async findFileById(fileId: string): Promise<FileRecord | undefined> {
    const [fileRecord] = await db
      .select()
      .from(files)
      .where(eq(files.id, fileId));
    return fileRecord;
  }

  async listFilesByUploader(
    uploaderId: string,
    pagination: { page: number; limit: number },
  ): Promise<{ data: FileRecord[]; total: number; page: number; limit: number }> {
    const offset = (pagination.page - 1) * pagination.limit;

    const data = await db
      .select()
      .from(files)
      .where(eq(files.uploaderId, uploaderId))
      .orderBy(desc(files.createdAt))
      .limit(pagination.limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files)
      .where(eq(files.uploaderId, uploaderId));

    const total = Number(countResult?.count || 0);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async deleteFileRecord(fileId: string): Promise<void> {
    await db.delete(files).where(eq(files.id, fileId));
  }
}
