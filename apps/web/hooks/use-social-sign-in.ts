import { useMutation } from '@tanstack/react-query';
import { App as AntdApp } from 'antd';
import type { SocialProvider } from '@repo/types';
import { authClient } from '@/lib/auth-client';

export function useSocialSignIn(callbackURL = '/dashboard') {
  const { message } = AntdApp.useApp();

  return useMutation({
    mutationFn: async (provider: SocialProvider) => {
      const res = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (res?.error) {
        throw new Error(res.error.message || `Failed to sign in with ${provider}`);
      }

      return res;
    },
    onError: (err: Error) => {
      message.error(err.message);
    },
  });
}
