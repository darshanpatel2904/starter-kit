"use client";

import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Typography, Button, Space, Descriptions, Tag, Avatar, App as AntdApp } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { authClient } from "@/lib/auth-client";

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [isSigningOut, startSignOutTransition] = useTransition();

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace("/login");
    }
  }, [sessionLoading, session, router]);

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      try {
        await authClient.signOut();
        message.success("Logged out successfully");
        router.push("/login");
      } catch {
        message.error("Failed to sign out");
      }
    });
  };

  if (sessionLoading || !session?.user) return null;

  const user = session.user;

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 20px", width: "100%" }}>
      {/* Header / Banner */}
      <Card
        variant="borderless"
        style={{
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" align="center">
            <Avatar
              size={64}
              src={user.image}
              icon={!user.image && <UserOutlined />}
              style={{ backgroundColor: "#1677ff", fontSize: 28 }}
            />
            <div>
              <Space align="center" size="small">
                <Title level={3} style={{ margin: 0 }}>
                  Dashboard
                </Title>
                <Tag color="blue" icon={<DashboardOutlined />}>
                  Protected Area
                </Tag>
              </Space>
              <Paragraph type="secondary" style={{ margin: "4px 0 0" }}>
                Welcome back, <Text strong>{user.name || user.email}</Text>!
              </Paragraph>
            </div>
          </Space>

          <Space size="small">
            <Link href="/profile">
              <Button icon={<SettingOutlined />}>
                Profile Settings
              </Button>
            </Link>
            <Button
              danger
              icon={<LogoutOutlined />}
              loading={isSigningOut}
              onClick={handleSignOut}
            >
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
            <UserOutlined style={{ color: "#1677ff" }} />
            <span>User Session Information</span>
          </Space>
        }
        style={{
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Full Name">
            {user.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Email Address">
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="User ID">
            <Text code>{user.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            <Tag color="green">Active Session</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Protected Content Section */}
      <Card
        variant="borderless"
        title={
          <Space align="center">
            <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
            <span>Protected Content</span>
          </Space>
        }
        style={{
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
          borderRadius: 16,
        }}
      >
        <Paragraph style={{ fontSize: 16, marginBottom: 0 }}>
          This dashboard is rendered with <Text strong>Client Session Authorization</Text> and protected by <Text strong>Better Auth</Text>.
          Only authenticated users with an active session can view this page.
        </Paragraph>
      </Card>
    </div>
  );
}