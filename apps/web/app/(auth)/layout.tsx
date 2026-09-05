import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 16px",
                minHeight: "calc(100vh - 120px)",
                background: "radial-gradient(circle at 50% 30%, rgba(22, 119, 255, 0.05) 0%, transparent 70%)",
            }}
        >
            <div style={{ width: "100%", maxWidth: 440 }}>
                {children}
            </div>
        </div>
    );
}
