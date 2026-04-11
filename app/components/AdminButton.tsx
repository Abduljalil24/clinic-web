"use client";

import Link from "next/link";

type AdminButtonProps = {
  compact?: boolean;
};

export default function AdminButton({ compact = false }: AdminButtonProps) {
  return (
    <Link
      href="/admin"
      aria-label="الدخول إلى لوحة الإدارة"
      style={{
        textDecoration: "none",
        display: "inline-flex",
      }}
    >
      <div
        style={{
          minWidth: compact ? "44px" : "auto",
          height: compact ? "44px" : "46px",
          padding: compact ? "0 12px" : "0 16px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.22)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "white",
          fontSize: "0.98rem",
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
          backdropFilter: "blur(6px)",
          transition: "all 0.25s ease",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "1.15rem",
            lineHeight: 1,
          }}
        >
          🔒
        </span>

        {!compact && (
          <span
            style={{
              lineHeight: 1,
            }}
          >
            الإدارة
          </span>
        )}
      </div>
    </Link>
  );
}