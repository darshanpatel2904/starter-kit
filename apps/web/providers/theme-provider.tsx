'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp, Layout } from 'antd';

type ThemeContextType = {
  isDarkMode: boolean;
  mounted: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  mounted: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDarkMode(stored === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, mounted, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
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
          <Layout style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>{children}</Layout>
        </AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
