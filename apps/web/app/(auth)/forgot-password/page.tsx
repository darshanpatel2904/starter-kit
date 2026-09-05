"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, Form, Input, Button, Result, Typography, App as AntdApp } from "antd";
import { MailOutlined, ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import type { ForgotPasswordFormValues } from "@repo/types";
import { authClient } from "@/lib/auth-client";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
    const [form] = Form.useForm<ForgotPasswordFormValues>();
    const [isPending, startTransition] = useTransition();
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
    const { message } = AntdApp.useApp();

    const onFinish = (values: ForgotPasswordFormValues) => {
        startTransition(async () => {
            try {
                const res = await authClient.requestPasswordReset({
                    email: values.email,
                    redirectTo: "/reset-password",
                });

                if (res?.error) {
                    message.error(res.error.message || "Failed to send reset email");
                } else {
                    setSubmittedEmail(values.email);
                    message.success("Password reset email sent!");
                }
            } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
                message.error(errorMsg);
            }
        });
    };

    const handleResetEmail = () => {
        setSubmittedEmail(null);
        form.resetFields();
    };


    if (submittedEmail) {
        return (
            <Card
                variant="borderless"
                style={{
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
                    borderRadius: 16,
                }}
            >
                <Result
                    status="success"
                    title="Check your email"
                    subTitle={`We have sent a password reset link to ${submittedEmail}. Please check your inbox and follow the instructions.`}
                    extra={[
                        <Link href="/login" key="login">
                            <Button type="primary" icon={<ArrowLeftOutlined />}>
                                Back to Login
                            </Button>
                        </Link>,
                        <Button
                            key="resend"
                            type="text"
                            onClick={handleResetEmail}
                        >
                            Try another email
                        </Button>,
                    ]}
                />
            </Card>
        );
    }

    return (
        <Card
            variant="borderless"
            style={{
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
                borderRadius: 16,
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                    Reset Password
                </Title>
                <Text type="secondary">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </Text>
            </div>

            <Form
                form={form}
                name="forgot_password_form"
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
            >
                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                        { required: true, message: "Please enter your email address!" },
                        { type: "email", message: "Please enter a valid email address!" },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="name@example.com"
                        size="large"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        icon={<SendOutlined />}
                        loading={isPending}
                    >
                        Send Reset Link
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <ArrowLeftOutlined /> Back to Sign In
                </Link>
            </div>
        </Card>
    );
}
