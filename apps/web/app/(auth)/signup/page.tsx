'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Divider, Typography, Space, App as AntdApp } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  GoogleOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import type { SignUpFormValues, SocialProvider } from '@repo/types';
import { authClient } from '@/lib/auth-client';
import { useSocialSignIn } from '@/hooks/use-social-sign-in';

const { Title, Text } = Typography;

export default function SignUpPage() {
  const [form] = Form.useForm<SignUpFormValues>();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const res = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        throw new Error(res.error.message || 'Sign up failed');
      }

      return res;
    },
    onSuccess: () => {
      message.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (err: Error) => {
      message.error(err.message || 'An unexpected error occurred during registration');
    },
  });

  const {
    mutate: socialSignIn,
    isPending: isSocialPending,
    variables: socialProvider,
  } = useSocialSignIn('/dashboard');

  const onFinish = (values: SignUpFormValues) => {
    signUp(values);
  };

  const handleSocialSignIn = (provider: SocialProvider) => {
    socialSignIn(provider);
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
          Create Account
        </Title>
        <Text type="secondary">Get started with your free StarterKit account</Text>
      </div>

      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <Button
          block
          size="large"
          icon={<GoogleOutlined />}
          loading={isSocialPending && socialProvider === 'google'}
          onClick={() => handleSocialSignIn('google')}
        >
          Sign up with Google
        </Button>
        <Button
          block
          size="large"
          icon={<GithubOutlined />}
          loading={isSocialPending && socialProvider === 'github'}
          onClick={() => handleSocialSignIn('github')}
        >
          Sign up with GitHub
        </Button>
      </Space>

      <Divider style={{ margin: '20px 0' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          OR
        </Text>
      </Divider>

      <Form
        form={form}
        name="signup_form"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
        </Form.Item>

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
          rules={[
            { required: true, message: 'Please enter a password!' },
            { min: 8, message: 'Password must be at least 8 characters!' },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="At least 8 characters"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" size="large" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<UserAddOutlined />}
            loading={isSignUpPending}
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text type="secondary">
          Already have an account?{' '}
          <Link href="/login" style={{ fontWeight: 500 }}>
            Sign in
          </Link>
        </Text>
      </div>
    </Card>
  );
}
