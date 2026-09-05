'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  Space,
  App as AntdApp,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import type { LoginFormValues, SocialProvider } from '@repo/types';
import { authClient } from '@/lib/auth-client';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const [isPending, startTransition] = useTransition();
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const onFinish = (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        const res = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });

        if (res?.error) {
          message.error(res.error.message || 'Invalid email or password');
        } else {
          message.success('Logged in successfully!');
          router.push('/dashboard');
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
        message.error(errorMsg);
      }
    });
  };

  const handleSocialSignIn = (provider: SocialProvider) => {
    setSocialLoading(provider);
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider,
          callbackURL: '/dashboard',
        });
      } catch {
        message.error(`Failed to sign in with ${provider}`);
        setSocialLoading(null);
      }
    });
  };

  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: 16,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>
          Welcome Back
        </Title>
        <Text type="secondary">Sign in to your StarterKit account</Text>
      </div>

      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <Button
          block
          size="large"
          icon={<GoogleOutlined />}
          loading={isPending && socialLoading === 'google'}
          onClick={() => handleSocialSignIn('google')}
        >
          Continue with Google
        </Button>
        <Button
          block
          size="large"
          icon={<GithubOutlined />}
          loading={isPending && socialLoading === 'github'}
          onClick={() => handleSocialSignIn('github')}
        >
          Continue with GitHub
        </Button>
      </Space>

      <Divider style={{ margin: '20px 0' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          OR
        </Text>
      </Divider>

      <Form
        form={form}
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="name@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link href="/forgot-password" style={{ fontSize: 14 }}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<LoginOutlined />}
            loading={isPending && !socialLoading}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text type="secondary">
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ fontWeight: 500 }}>
            Sign up
          </Link>
        </Text>
      </div>
    </Card>
  );
}
