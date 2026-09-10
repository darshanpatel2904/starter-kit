'use client';

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
import { useMutation } from '@tanstack/react-query';
import type { LoginFormValues, SocialProvider } from '@repo/types';
import { authClient } from '@/lib/auth-client';
import { useSocialSignIn } from '@/hooks/use-social-sign-in';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.remember,
      });

      if (res?.error) {
        throw new Error(res.error.message || 'Invalid email or password');
      }

      return res;
    },
    onSuccess: () => {
      message.success('Logged in successfully!');
      router.push('/dashboard');
    },
    onError: (err: Error) => {
      message.error(err.message || 'An unexpected error occurred');
    },
  });

  const {
    mutate: socialSignIn,
    isPending: isSocialPending,
    variables: socialProvider,
  } = useSocialSignIn('/dashboard');

  const onFinish = (values: LoginFormValues) => {
    login(values);
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
          Welcome Back
        </Title>
        <Text type="secondary">Sign in to your StarterKit account</Text>
      </div>

      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <Button
          block
          size="large"
          icon={<GoogleOutlined />}
          loading={isSocialPending && socialProvider === 'google'}
          onClick={() => handleSocialSignIn('google')}
        >
          Continue with Google
        </Button>
        <Button
          block
          size="large"
          icon={<GithubOutlined />}
          loading={isSocialPending && socialProvider === 'github'}
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
            loading={isLoginPending}
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
