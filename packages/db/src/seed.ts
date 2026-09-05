import { db } from './client';
import { users } from './schema/users';

async function main() {
  console.log('🌱 Seeding database...');

  await db
    .insert(users)
    .values({
      id: 'demo-user-id',
      name: 'Demo Admin',
      email: 'admin@starterkit.dev',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing();

  console.log('✅ Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
