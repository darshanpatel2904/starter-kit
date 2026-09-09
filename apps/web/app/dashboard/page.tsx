'use client';

import { useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Button, Space, Descriptions, Tag, Avatar, App as AntdApp } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { authClient } from '@/lib/auth-client';

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [isSigningOut, startSignOutTransition] = useTransition();

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace('/login');
    }
  }, [sessionLoading, session, router]);

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      try {
        await authClient.signOut();
        message.success('Logged out successfully');
        router.push('/login');
      } catch {
        message.error('Failed to sign out');
      }
    });
  };

  if (sessionLoading || !session?.user) return null;

  const user = session.user;

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 20px', width: '100%' }}>
      {/* Header / Banner */}
      <Card
        variant="borderless"
        style={{
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Space size="middle" align="center">
            <Avatar
              size={64}
              src={user.image}
              icon={!user.image && <UserOutlined />}
              style={{ backgroundColor: '#143F3A', fontSize: 28 }}
            />
            <div>
              <Space align="center" size="small">
                <Title level={3} style={{ margin: 0, color: '#1C1C1C' }}>
                  Dashboard
                </Title>
                <Tag
                  style={{
                    background: '#EFE7D8',
                    color: '#1C1C1C',
                    border: '1px solid rgba(28, 28, 28, 0.1)',
                    borderRadius: 12,
                  }}
                  icon={<DashboardOutlined style={{ color: '#143F3A' }} />}
                >
                  Protected Area
                </Tag>
              </Space>
              <Paragraph type="secondary" style={{ margin: '4px 0 0', color: '#4A4A4A' }}>
                Welcome back, <Text strong>{user.name || user.email}</Text>!
              </Paragraph>
            </div>
          </Space>

          <Space size="small">
            <Button danger icon={<LogoutOutlined />} loading={isSigningOut} onClick={handleSignOut}>
              Sign Out
            </Button>
          </Space>
        </div>
      </Card>

      {/* User Account Info */}
      <Card
        variant="borderless"
        title={
          <Space align="center">
            <UserOutlined style={{ color: '#143F3A' }} />
            <span style={{ color: '#1C1C1C' }}>User Session Information</span>
          </Space>
        }
        style={{
          boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
          borderRadius: 20,
          marginBottom: 24,
          border: '1px solid rgba(28, 28, 28, 0.08)',
        }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Full Name">{user.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email Address">{user.email}</Descriptions.Item>
          <Descriptions.Item label="User ID">
            <Text code>{user.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            <Tag
              style={{
                background: 'rgba(95, 194, 174, 0.15)',
                color: '#143F3A',
                border: '1px solid rgba(95, 194, 174, 0.3)',
                borderRadius: 12,
              }}
            >
              Active Session
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Protected Content Section */}
      <Card
        variant="borderless"
        title={
          <Space align="center">
            <SafetyCertificateOutlined style={{ color: '#5FC2AE' }} />
            <span style={{ color: '#1C1C1C' }}>Protected Content</span>
          </Space>
        }
        style={{
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
        }}
      >
        <Paragraph style={{ fontSize: 16, marginBottom: 0 }}>
          This dashboard is rendered with <Text strong>Client Session Authorization</Text> and
          protected by <Text strong>Better Auth</Text>. Only authenticated users with an active
          session can view this page.
        </Paragraph>
      </Card>
    </div>
  );
}
