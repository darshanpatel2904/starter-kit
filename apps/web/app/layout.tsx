import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdProvider } from '../providers/antd-provider';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'StarterKit Auth | Better Auth + Ant Design',
  description: 'Next.js App Router authentication system powered by Better Auth and Ant Design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <AntdRegistry>
          <AntdProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
              <Footer />
            </div>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
