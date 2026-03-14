"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminButton from "./components/AdminButton";
import "./globals.css";
import "./responsive.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false); // 👈 حالة القائمة

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav>
          {/* زر القائمة للجوال - يظهر فقط في الشاشات الصغيرة */}
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className="logo-container">
            <div className="logo-icon">
              <Image 
                src="/logo.png" 
                alt="شعار مركز آسيا الطبي"
                width={50}
                height={50}
                style={{ 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                priority
              />
            </div>
            <div className="logo-text">
              مركز آسيا الطبي
              <span>د. أسيا محمد ناجي</span>
            </div>
          </div>

          {/* القائمة - نضيف class open لو كانت مفتوحة */}
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>عن الطبيبة</Link>
            <Link href="/services" onClick={() => setMenuOpen(false)}>خدمات العيادة</Link>
            <Link href="/lab" onClick={() => setMenuOpen(false)}>خدمات المختبر</Link>
            <Link href="/book" onClick={() => setMenuOpen(false)}>حجز موعد</Link>
            <Link href="/verify" onClick={() => setMenuOpen(false)}>التحقق من الحجز</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
          </div>

          {/* زر الدخول للإدارة */}
          {/* زر الدخول للإدارة - نسخة مبسطة للموبايل */}
          <div className="admin-login">
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.3rem'
              }}>
                🔒
              </div>
            </Link>
          </div>
        </nav>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}