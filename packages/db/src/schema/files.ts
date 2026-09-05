import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, bigint, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull(),
  mimeType: text('mime_type').notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  status: text('status', { enum: ['PENDING', 'COMPLETED', 'ABORTED'] })
    .default('PENDING')
    .notNull(),
  uploadId: text('upload_id'),
  uploaderId: text('uploader_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  uploader: one(users, {
    fields: [files.uploaderId],
    references: [users.id],
  }),
}));

export type FileRecord = typeof files.$inferSelect;
export type NewFileRecord = typeof files.$inferInsert;
