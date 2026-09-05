"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from "react";

import { ConfigProvider, theme as antdTheme, App as AntdApp, Layout } from "antd";

type ThemeContextType = {
    isDarkMode: boolean;
    mounted: boolean;
    toggleTheme: () => void;
};

const emptySubscribe = () => () => {};
function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    mounted: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

function ThemeBodySync({ children }: { children: React.ReactNode }) {
    const { token } = antdTheme.useToken();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.style.backgroundColor = token.colorBgLayout;
            document.body.style.color = token.colorText;
            document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";

            if (isDarkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [token.colorBgLayout, token.colorText, isDarkMode]);

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: token.colorBgLayout,
                color: token.colorText,
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            {children}
        </Layout>
    );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const mounted = useIsMounted();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) return storedTheme === "dark";
        return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    });



    const toggleTheme = useCallback(() => {
        setIsDarkMode((prev) => {
            const next = !prev;
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", next ? "dark" : "light");
            }
            return next;
        });
    }, []);

    const currentAlgorithm = isDarkMode
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm;

    return (
        <ThemeContext.Provider value={{ isDarkMode, mounted, toggleTheme }}>
            <ConfigProvider
                theme={{
                    algorithm: currentAlgorithm,
                    token: {
                        colorPrimary: "#1677ff",
                        borderRadius: 8,
                        fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    },
                    components: {
                        Button: {
                            borderRadius: 6,
                            controlHeight: 40,
                        },
                        Input: {
                            controlHeight: 40,
                        },
                        Card: {
                            borderRadiusLG: 12,
                        },
                    },
                }}
            >
                <AntdApp>
                    <ThemeBodySync>{children}</ThemeBodySync>
                </AntdApp>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

