import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from '@better-auth/passkey/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  plugins: [passkeyClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  resetPassword,
  changePassword,
  listSessions,
  revokeSession,
  updateUser,
} = authClient;
