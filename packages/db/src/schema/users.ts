import { relations } from 'drizzle-orm';
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sessions } from './sessions';
import { accounts } from './accounts';
import { passkeys } from './passkeys';
import { files } from './files';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  passkeys: many(passkeys),
  files: many(files),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
