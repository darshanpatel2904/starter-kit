'use client';

import { Layout, Typography, Space } from 'antd';
import { GithubOutlined, HeartFilled } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export function Footer() {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#1C1C1C',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px 50px',
        color: '#F5F2ED',
      }}
    >
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Text style={{ color: 'rgba(245, 242, 237, 0.7)', fontSize: 13 }}>
          StarterKit Auth ©{new Date().getFullYear()} Built with Better Auth & Ant Design{' '}
          <HeartFilled style={{ color: '#EF5B5B' }} />
        </Text>
        <Space size="large" separator={<Text style={{ color: '#9A8D77' }}>|</Text>}>
          <Link
            href="https://github.com/WebDevSimplified/better-auth-crash-course"
            target="_blank"
            style={{ color: '#5FC2AE' }}
          >
            <GithubOutlined /> Reference Crash Course
          </Link>
          <Link href="https://ant.design" target="_blank" style={{ color: '#5FC2AE' }}>
            Ant Design Docs
          </Link>
          <Link href="https://www.better-auth.com" target="_blank" style={{ color: '#5FC2AE' }}>
            Better Auth Docs
          </Link>
        </Space>
      </Space>
    </AntFooter>
  );
}
