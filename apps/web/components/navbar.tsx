'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Button, Avatar, Dropdown, Space, Typography, App as AntdApp } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
  DashboardOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '../lib/auth-client';

const { Header } = Layout;
const { Text } = Typography;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const { data: session, isPending } = authClient.useSession();

  const { mutate: signOut } = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      message.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      message.error('Failed to log out');
    },
  });

  const handleSignOut = () => {
    signOut();
  };

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div style={{ padding: '6px 4px' }}>
          <Text strong style={{ display: 'block', fontSize: 14 }}>
            {session?.user?.name || 'User'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {session?.user?.email}
          </Text>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'upload',
      icon: <CloudUploadOutlined />,
      label: <Link href="/upload">S3 Uploads</Link>,
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Sign Out',
      onClick: handleSignOut,
    },
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(245, 242, 237, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(28, 28, 28, 0.08)',
        boxShadow: '0 4px 20px rgba(28, 28, 28, 0.03)',
      }}
    >
      <Space size="large" align="center">
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #143F3A 0%, #1C1C1C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5F2ED',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            <SafetyCertificateOutlined />
          </div>
          <Text strong style={{ fontSize: 18, letterSpacing: '-0.5px', color: '#1C1C1C' }}>
            StarterKit Auth
          </Text>
        </Link>

        <Space size="middle" style={{ marginLeft: 16 }}>
          <Link href="/">
            <Button type={pathname === '/' ? 'primary' : 'text'} icon={<HomeOutlined />}>
              Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              type={pathname.startsWith('/dashboard') ? 'primary' : 'text'}
              icon={<DashboardOutlined />}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/upload">
            <Button
              type={pathname.startsWith('/upload') ? 'primary' : 'text'}
              icon={<CloudUploadOutlined />}
            >
              S3 Upload
            </Button>
          </Link>
        </Space>
      </Space>

      <Space size="middle" align="center">
        <div>
          {!isPending && (
            <>
              {session?.user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Avatar
                    src={session.user.image}
                    icon={!session.user.image && <UserOutlined />}
                    style={{ backgroundColor: '#143F3A', cursor: 'pointer' }}
                  />
                </Dropdown>
              ) : (
                <Space size="small">
                  <Link href="/login">
                    <Button type={pathname === '/login' ? 'primary' : 'default'}>Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button type={pathname === '/signup' ? 'primary' : 'dashed'}>Sign Up</Button>
                  </Link>
                </Space>
              )}
            </>
          )}
        </div>
      </Space>
    </Header>
  );
}
