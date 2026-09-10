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
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#143F3A',
            colorInfo: '#143F3A',
            colorSuccess: '#5FC2AE',
            colorWarning: '#9A8D77',
            colorError: '#EF5B5B',
            colorBgBase: '#F5F2ED',
            colorBgContainer: '#FFFFFF',
            colorBgElevated: '#FFFFFF',
            colorBgLayout: '#F5F2ED',
            colorTextBase: '#1C1C1C',
            colorText: '#1C1C1C',
            colorTextSecondary: '#4A4A4A',
            colorTextTertiary: '#9A8D77',
            colorBorder: 'rgba(28, 28, 28, 0.12)',
            colorBorderSecondary: 'rgba(28, 28, 28, 0.06)',
            borderRadius: 12,
            borderRadiusLG: 20,
            borderRadiusSM: 8,
            borderRadiusXS: 6,
            fontFamily:
              'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
          },
          components: {
            Button: {
              colorPrimary: '#143F3A',
              colorPrimaryHover: '#1C1C1C',
              colorPrimaryActive: '#0E2C29',
              borderRadius: 24,
              controlHeight: 42,
              controlHeightLG: 48,
              controlHeightSM: 28,
              fontWeight: 600,
              defaultBg: 'rgba(255, 255, 255, 0.8)',
              defaultBorderColor: 'rgba(28, 28, 28, 0.15)',
              defaultColor: '#1C1C1C',
              defaultHoverBg: '#EFE7D8',
              defaultHoverBorderColor: 'rgba(28, 28, 28, 0.3)',
              defaultHoverColor: '#1C1C1C',
            },
            Input: {
              controlHeight: 44,
              borderRadius: 12,
              colorBgContainer: '#FFFFFF',
              colorBorder: 'rgba(28, 28, 28, 0.15)',
              activeBorderColor: '#9A8D77',
              hoverBorderColor: '#9A8D77',
              activeShadow: '0 0 0 2px rgba(154, 141, 119, 0.2)',
            },
            Select: {
              controlHeight: 44,
              borderRadius: 12,
              colorBgContainer: '#FFFFFF',
              colorBorder: 'rgba(28, 28, 28, 0.15)',
            },
            Card: {
              colorBgContainer: '#FFFFFF',
              borderRadiusLG: 20,
              colorBorderSecondary: 'rgba(28, 28, 28, 0.08)',
              boxShadowTertiary: '0 8px 28px rgba(28, 28, 28, 0.05)',
            },
            Layout: {
              headerBg: '#F5F2ED',
              bodyBg: '#F5F2ED',
              footerBg: '#1C1C1C',
              headerHeight: 68,
              headerColor: '#1C1C1C',
            },
            Dropdown: {
              colorBgElevated: '#FFFFFF',
              borderRadiusLG: 16,
              boxShadowSecondary: '0 10px 30px rgba(28, 28, 28, 0.12)',
            },
            Menu: {
              colorBgContainer: 'transparent',
              itemColor: '#4A4A4A',
              itemSelectedColor: '#143F3A',
              itemHoverColor: '#1C1C1C',
              itemSelectedBg: '#EFE7D8',
              borderRadius: 10,
            },
            Tag: {
              borderRadiusSM: 12,
              defaultBg: '#EFE7D8',
              defaultColor: '#1C1C1C',
              colorText: '#1C1C1C',
              colorSuccess: '#064E3B',
              colorSuccessBg: '#D1FAE5',
              colorSuccessBorder: '#6EE7B7',
              colorInfo: '#0C4A6E',
              colorInfoBg: '#E0F2FE',
              colorInfoBorder: '#7DD3FC',
              colorWarning: '#78350F',
              colorWarningBg: '#FEF3C7',
              colorWarningBorder: '#FCD34D',
              colorError: '#7F1D1D',
              colorErrorBg: '#FEE2E2',
              colorErrorBorder: '#FCA5A5',
            },
            Modal: {
              contentBg: '#FFFFFF',
              headerBg: '#FFFFFF',
              borderRadiusLG: 24,
            },
            Table: {
              colorBgContainer: '#FFFFFF',
              headerBg: '#EFE7D8',
              headerColor: '#1C1C1C',
              rowHoverBg: '#F5F2ED',
              borderRadiusLG: 16,
            },
            Tabs: {
              itemColor: '#4A4A4A',
              itemSelectedColor: '#143F3A',
              itemHoverColor: '#1C1C1C',
              inkBarColor: '#143F3A',
            },
            Typography: {
              colorText: '#1C1C1C',
              colorTextDescription: '#4A4A4A',
              colorTextHeading: '#1C1C1C',
            },
            Avatar: {
              colorBgBase: '#143F3A',
            },
            Alert: {
              borderRadiusLG: 16,
            },
            Upload: {
              colorBgContainer: '#FAF8F5',
              colorFillAlter: '#FAF8F5',
              colorBorder: 'rgba(20, 63, 58, 0.25)',
              colorPrimaryHover: '#143F3A',
              colorText: '#1C1C1C',
              colorTextDescription: '#4A4A4A',
              colorTextHeading: '#1C1C1C',
              borderRadiusLG: 16,
            },
            Progress: {
              defaultColor: '#143F3A',
              remainingColor: 'rgba(20, 63, 58, 0.1)',
              circleTextColor: '#1C1C1C',
            },
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
