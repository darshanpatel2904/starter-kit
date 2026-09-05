"use client";

import Link from "next/link";
import { Card, Typography, Button, Space, Row, Col, Tag } from "antd";
import {
  SafetyCertificateOutlined,
  UserOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { authClient } from "@/lib/auth-client";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px", width: "100%" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "40px 0 60px" }}>
        <Tag color="blue" style={{ padding: "4px 12px", borderRadius: 12, fontSize: 14, marginBottom: 16 }}>
          Next.js 16 + Ant Design + Better Auth
        </Tag>
        <Title level={1} style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
          Authentication Made Elegant & Secure
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 18, maxWidth: 640, margin: "0 auto 32px" }}>
          Full-featured authentication architecture with Ant Design SSR integration, dynamic theme switching, email/password login, social providers, and active session control.
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
              height: "100%",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "rgba(22, 119, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1677ff",
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <SafetyCertificateOutlined />
            </div>
            <Title level={4}>Better Auth Engine</Title>
            <Text type="secondary">
              Email/Password, Password Reset flows, Social OAuth (Google/GitHub), and active session tracking using Better Auth.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            style={{
              height: "100%",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "rgba(82, 196, 26, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#52c41a",
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <ThunderboltOutlined />
            </div>
            <Title level={4}>Antd Next.js SSR</Title>
            <Text type="secondary">
              Zero FOUC (flash of unstyled content) server-side rendering setup with @ant-design/nextjs-registry in App Router.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            style={{
              height: "100%",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "rgba(250, 173, 20, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#faad14",
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              <BgColorsOutlined />
            </div>
            <Title level={4}>Dynamic Theme Switcher</Title>
            <Text type="secondary">
              Seamlessly toggle between Light and Dark mode using Ant Design ConfigProvider algorithms and local storage persistence.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}