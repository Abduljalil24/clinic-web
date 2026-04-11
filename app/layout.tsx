"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./globals.css";
import "./responsive.css";

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الطبيبات" },
  { href: "/services", label: "خدمات العيادة" },
  { href: "/lab", label: "خدمات المختبر" },
  { href: "/book", label: "حجز موعد" },
  { href: "/verify", label: "التحقق من الحجز" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <title>مركز آسيا الطبي</title>
      </head>

      <body>
        <nav>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <Link
            href="/"
            className="logo-container"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none" }}
            aria-label="الانتقال إلى الصفحة الرئيسية"
          >
            <div className="logo-icon">
              <Image
                src="/logo.png"
                alt="شعار مركز آسيا الطبي"
                width={50}
                height={50}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                priority
              />
            </div>

            <div className="logo-text">
              مركز آسيا الطبي
              <span>د. آسيا محمد ناجي</span>
            </div>
          </Link>

          <div id="main-navigation" className={`nav-links ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActiveLink(item.href) ? "page" : undefined}
                style={{
                  opacity: isActiveLink(item.href) ? 1 : undefined,
                  fontWeight: isActiveLink(item.href) ? 800 : undefined,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="admin-login">
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{ textDecoration: "none" }}
              aria-label="الدخول إلى لوحة الإدارة"
            >
              <div
                style={{
                  minWidth: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  padding: "0 14px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                  transition: "all 0.25s ease",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>🔒</span>
                <span className="admin-login-label">الإدارة</span>
              </div>
            </Link>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}