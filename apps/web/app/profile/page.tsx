"use client";

import { useTransition } from "react";
import {
  Card,
  Tabs,
  Typography,
  Form,
  Input,
  Button,
  Avatar,
  Descriptions,
  Tag,
  Space,
  App as AntdApp,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import type { ProfileFormValues, PasswordFormValues } from "@repo/types";
import { authClient } from "@/lib/auth-client";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { message } = AntdApp.useApp();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();

  const [isUpdatingProfile, startUpdateProfileTransition] = useTransition();
  const [isChangingPassword, startChangePasswordTransition] = useTransition();

  const onUpdateProfile = (values: ProfileFormValues) => {
    startUpdateProfileTransition(async () => {
      try {
        const res = await authClient.updateUser({
          name: values.name,
        });
        if (res?.error) {
          message.error(res.error.message || "Failed to update profile");
        } else {
          message.success("Profile updated successfully!");
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        message.error(errorMsg);
      }
    });
  };

  const onChangePassword = (values: PasswordFormValues) => {
    startChangePasswordTransition(async () => {
      try {
        const res = await authClient.changePassword({
          newPassword: values.newPassword,
          currentPassword: values.currentPassword,
          revokeOtherSessions: values.revokeOthers ?? true,
        });

        if (res?.error) {
          message.error(res.error.message || "Failed to change password");
        } else {
          message.success("Password changed successfully!");
          passwordForm.resetFields();
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        message.error(errorMsg);
      }
    });
  }

  if (sessionLoading || !session?.user) return null;

  const user = session.user;

  const tabItems = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined /> General Information
        </span>
      ),
      children: (
        <div style={{ paddingTop: 16 }}>
          <Descriptions title="Account Summary" bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="Email Address">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Account Status">
              <Tag color="blue">Active</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Card style={{ marginTop: 24 }} title="Update Profile Details">
            <Form
              form={profileForm}
              layout="vertical"
              initialValues={{ name: user.name }}
              onFinish={onUpdateProfile}
            >
              <Form.Item
                name="name"
                label="Display Name"
                rules={[{ required: true, message: "Please enter your display name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your Name" size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<EditOutlined />}
                loading={isUpdatingProfile}
              >
                Save Changes
              </Button>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <LockOutlined /> Security & Password
        </span>
      ),
      children: (
        <div style={{ paddingTop: 16, maxWidth: 500 }}>
          <Card title="Change Password">
            <Form form={passwordForm} layout="vertical" onFinish={onChangePassword}>
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: "Please enter current password" }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter new password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password prefix={<KeyOutlined />} size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SafetyCertificateOutlined />}
                loading={isChangingPassword}
              >
                Update Password
              </Button>
            </Form>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px", width: "100%" }}>
      <Card
        variant="borderless"
        style={{
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <Space size="large" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
          <Space size="large" align="center">
            <Avatar
              size={72}
              src={user.image}
              icon={!user.image && <UserOutlined />}
              style={{ backgroundColor: "#1677ff", fontSize: 32 }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {user.name || "User Profile"}
              </Title>
              <Text type="secondary">{user.email}</Text>
            </div>
          </Space>
          <Tag color="green" style={{ padding: "4px 12px", borderRadius: 12, fontSize: 13 }}>
            Verified User
          </Tag>
        </Space>
      </Card>

      <Card
        variant="borderless"
        style={{
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
          borderRadius: 16,
        }}
      >
        <Tabs defaultActiveKey="profile" items={tabItems} size="large" />
      </Card>
    </div>
  );
}
