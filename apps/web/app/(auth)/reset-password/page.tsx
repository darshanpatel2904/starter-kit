'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, Form, Input, Button, Result, Typography, Skeleton, App as AntdApp } from 'antd';
import { LockOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import type { ResetPasswordFormValues } from '@repo/types';
import { authClient } from '@/lib/auth-client';

const { Title, Text } = Typography;

function ResetPasswordSkeleton() {
  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: 16,
      }}
    >
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const [isSuccess, setIsSuccess] = useState(false);
  const { message } = AntdApp.useApp();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      if (!token) {
        throw new Error('Reset token is missing or invalid. Please request a new link.');
      }

      const res = await authClient.resetPassword({
        newPassword: values.newPassword,
        token,
      });

      if (res?.error) {
        throw new Error(res.error.message || 'Failed to reset password');
      }

      return res;
    },
    onSuccess: () => {
      setIsSuccess(true);
      message.success('Password reset successfully!');
    },
    onError: (err: Error) => {
      message.error(err.message || 'An unexpected error occurred');
    },
  });

  const onFinish = (values: ResetPasswordFormValues) => {
    resetPassword(values);
  };

  if (isSuccess) {
    return (
      <Card
        variant="borderless"
        style={{
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
          borderRadius: 16,
        }}
      >
        <Result
          status="success"
          title="Password Reset Complete"
          subTitle="Your password has been successfully updated. You can now sign in with your new password."
          extra={[
            <Link href="/login" key="login">
              <Button type="primary" size="large">
                Sign In Now
              </Button>
            </Link>,
          ]}
        />
      </Card>
    );
  }

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
          Set New Password
        </Title>
        <Text type="secondary">Enter your new password below to secure your account.</Text>
      </div>

      {!token && (
        <div style={{ marginBottom: 20 }}>
          <Text type="danger" style={{ display: 'block', textAlign: 'center' }}>
            Warning: No reset token detected in URL query parameters.
          </Text>
        </div>
      )}

      <Form
        form={form}
        name="reset_password_form"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter a new password!' },
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
          label="Confirm New Password"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<KeyOutlined />}
            loading={isPending}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeftOutlined /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
