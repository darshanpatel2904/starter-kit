import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        minHeight: 'calc(100vh - 120px)',
        background:
          'radial-gradient(circle at 50% 30%, rgba(154, 141, 119, 0.15) 0%, transparent 75%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>{children}</div>
    </div>
  );
}
