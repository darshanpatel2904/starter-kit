'use client';

import Link from 'next/link';
import { Card, Typography, Button, Space, Row, Col, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  UserOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { authClient } from '@/lib/auth-client';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', width: '100%' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
        <Tag style={{ marginBottom: 20 }}>Next.js 16 + Ant Design + UI Light Theme</Tag>
        <Title
          level={1}
          style={{
            fontSize: 52,
            fontWeight: 300,
            letterSpacing: '-1.5px',
            marginBottom: 16,
            color: '#1C1C1C',
          }}
        >
          Authentication Made{' '}
          <span style={{ fontStyle: 'italic', color: '#9A8D77' }}>Elegant & Secure</span>
        </Title>
        <Paragraph
          type="secondary"
          style={{ fontSize: 18, maxWidth: 640, margin: '0 auto 32px', color: '#4A4A4A' }}
        >
          Full-featured authentication architecture with Ant Design SSR integration, light mode
          palette, email/password login, social providers, and active session control.
        </Paragraph>

        <Space size="middle">
          {user ? (
            <Link href="/profile">
              <Button type="primary" size="large" icon={<UserOutlined />}>
                Go to Profile Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  Get Started (Sign In)
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="large">Create Account</Button>
              </Link>
            </>
          )}
        </Space>
      </div>

      {/* Feature Grid */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            style={{
              height: '100%',
              boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
              borderRadius: 20,
              border: '1px solid rgba(28, 28, 28, 0.08)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(20, 63, 58, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#143F3A',
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <SafetyCertificateOutlined />
            </div>
            <Title level={4} style={{ color: '#1C1C1C' }}>
              Better Auth Engine
            </Title>
            <Text type="secondary" style={{ color: '#4A4A4A' }}>
              Email/Password, Password Reset flows, Social OAuth (Google/GitHub), and active session
              tracking using Better Auth.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            style={{
              height: '100%',
              boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
              borderRadius: 20,
              border: '1px solid rgba(28, 28, 28, 0.08)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(95, 194, 174, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#143F3A',
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <ThunderboltOutlined />
            </div>
            <Title level={4} style={{ color: '#1C1C1C' }}>
              Antd Next.js SSR
            </Title>
            <Text type="secondary" style={{ color: '#4A4A4A' }}>
              Zero FOUC (flash of unstyled content) server-side rendering setup with
              @ant-design/nextjs-registry in App Router.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            style={{
              height: '100%',
              boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
              borderRadius: 20,
              border: '1px solid rgba(28, 28, 28, 0.08)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(154, 141, 119, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9A8D77',
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <BgColorsOutlined />
            </div>
            <Title level={4} style={{ color: '#1C1C1C' }}>
              Light Theme
            </Title>
            <Text type="secondary" style={{ color: '#4A4A4A' }}>
              Clean, warm light algorithm with deep forest accent, taupe highlights, mint badges,
              and pill controls.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
