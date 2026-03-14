"use client";

import Link from "next/link";

export default function AdminButton() {
  return (
    <Link href="/admin" style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        padding: '8px 15px',
        borderRadius: '30px',
        color: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <span style={{ fontSize: '1.2rem' }}>🔒</span>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>الدخول للإدارة</span>
      </div>
    </Link>
  );
}