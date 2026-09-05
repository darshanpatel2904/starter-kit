"use client";

import { Layout, Typography, Space } from "antd";
import { GithubOutlined, HeartFilled } from "@ant-design/icons";
import { useTheme } from "../providers/theme-provider";

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export function Footer() {
    const { isDarkMode } = useTheme();

    return (
        <AntFooter
            style={{
                textAlign: "center",
                background: isDarkMode ? "#141414" : "#fafafa",
                borderTop: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                padding: "24px 50px",
            }}
        >
            <Space orientation="vertical" size="small" style={{ width: "100%" }}>
                <Text type="secondary">
                    StarterKit Auth ©{new Date().getFullYear()} Built with Better Auth & Ant Design{" "}
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                </Text>
                <Space size="large" separator={<Text type="secondary">|</Text>}>
                    <Link href="https://github.com/WebDevSimplified/better-auth-crash-course" target="_blank">
                        <GithubOutlined /> Reference Crash Course
                    </Link>
                    <Link href="https://ant.design" target="_blank">
                        Ant Design Docs
                    </Link>
                    <Link href="https://www.better-auth.com" target="_blank">
                        Better Auth Docs
                    </Link>
                </Space>
            </Space>
        </AntFooter>
    );
}
