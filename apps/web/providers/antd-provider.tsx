'use client';

import React, { useState } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp, Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.darkAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif',
          },
          components: {
            Button: { borderRadius: 6, controlHeight: 40 },
            Input: { controlHeight: 40 },
            Card: { borderRadiusLG: 12 },
          },
        }}
      >
        <AntdApp>
          <Layout style={{ minHeight: '100vh' }}>{children}</Layout>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
