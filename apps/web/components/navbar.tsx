"use client";

import { useTransition } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Button, Avatar, Dropdown, Space, Typography, App as AntdApp } from "antd";
import {
    SunOutlined,
    MoonOutlined,
    UserOutlined,
    LogoutOutlined,
    SafetyCertificateOutlined,
    HomeOutlined,
    DashboardOutlined,
    CloudUploadOutlined,
} from "@ant-design/icons";
import { useTheme } from "../providers/theme-provider";
import { authClient } from "../lib/auth-client";

const { Header } = Layout;
const { Text } = Typography;

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { message } = AntdApp.useApp();
    const [, startTransition] = useTransition();
    const { isDarkMode, mounted, toggleTheme } = useTheme();
    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = () => {
        startTransition(async () => {
            try {
                await authClient.signOut();
                message.success("Logged out successfully");
                router.push("/login");
            } catch {
                message.error("Failed to log out");
            }
        });
    };


    const userMenuItems = [
        {
            key: "user-info",
            disabled: true,
            label: (
                <div style={{ padding: "6px 4px" }}>
                    <Text strong style={{ display: "block", fontSize: 14 }}>
                        {session?.user?.name || "User"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {session?.user?.email}
                    </Text>
                </div>
            ),
        },
        { type: "divider" as const },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: <Link href="/profile">Profile Settings</Link>,
        },
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            key: "upload",
            icon: <CloudUploadOutlined />,
            label: <Link href="/upload">S3 Uploads</Link>,
        },
        { type: "divider" as const },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            danger: true,
            label: "Sign Out",
            onClick: handleSignOut,
        },
    ];

    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                background: isDarkMode ? "#141414" : "#ffffff",
                borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
        >
            <Space size="large" align="center">
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        <SafetyCertificateOutlined />
                    </div>
                    <Text strong style={{ fontSize: 18, letterSpacing: "-0.5px" }}>
                        StarterKit Auth
                    </Text>
                </Link>

                <Space size="middle" style={{ marginLeft: 16 }}>
                    <Link href="/">
                        <Button type={pathname === "/" ? "primary" : "text"} icon={<HomeOutlined />}>
                            Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button type={pathname.startsWith("/dashboard") ? "primary" : "text"} icon={<DashboardOutlined />}>
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/upload">
                        <Button type={pathname.startsWith("/upload") ? "primary" : "text"} icon={<CloudUploadOutlined />}>
                            S3 Upload
                        </Button>
                    </Link>
                </Space>
            </Space>

            <Space size="middle" align="center">
                <Button
                    type="text"
                    shape="circle"
                    icon={mounted && isDarkMode ? <SunOutlined style={{ color: "#faad14" }} /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    title={mounted && isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                />

                <div>
                    {mounted && !isPending && (
                        <>
                            {session?.user ? (
                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                                    <Avatar
                                        src={session.user.image}
                                        icon={!session.user.image && <UserOutlined />}
                                        style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
                                        size="medium"
                                    />
                                </Dropdown>
                            ) : (
                                <Space size="small">
                                    <Link href="/login">
                                        <Button type={pathname === "/login" ? "primary" : "default"}>
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button type={pathname === "/signup" ? "primary" : "dashed"}>
                                            Sign Up
                                        </Button>
                                    </Link>
                                </Space>
                            )}
                        </>
                    )}
                </div>
            </Space>
        </Header>
    );
}
