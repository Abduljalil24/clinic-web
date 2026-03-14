"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";

type Result = {
  booking_number: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  patient_name?: string;
  patient_phone?: string;
};

export default function VerifyPage() {
  const params = useSearchParams();
  const initial = params.get("code") ?? "";

  const [code, setCode] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" | "info" } | null>(null);
  const [copied, setCopied] = useState(false);

  const verifyUrl = useMemo(() => {
    if (!code) return "";
    return `${window.location.origin}/verify?code=${encodeURIComponent(code)}`;
  }, [code]);

  const search = async (c: string) => {
    setMsg(null);
    setResult(null);

    if (!c.trim()) {
      setMsg({ text: "⚠️ الرجاء إدخال رقم الحجز", type: "error" });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.rpc("get_appointment_public", {
      p_booking: c.trim(),
    });

    setLoading(false);

    if (error) {
      setMsg({ text: `❌ تعذر التحقق: ${error.message}`, type: "error" });
      return;
    }

    const row = (data?.[0] ?? null) as Result | null;
    if (!row) {
      setMsg({ text: "❌ رقم الحجز غير موجود", type: "error" });
      return;
    }

    setResult(row);
    setMsg({ text: "✅ تم العثور على الحجز بنجاح", type: "success" });
  };

  useEffect(() => {
    if (initial) search(initial);
  }, [initial]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string; text: string; icon: string }> = {
      confirmed: { color: "#065f46", bg: "#d1fae5", text: "مؤكد", icon: "✅" },
      pending: { color: "#92400e", bg: "#fef3c7", text: "قيد الانتظار", icon: "⏳" },
      cancelled: { color: "#991b1b", bg: "#fee2e2", text: "ملغي", icon: "❌" },
      completed: { color: "#1e40af", bg: "#dbeafe", text: "مكتمل", icon: "🎉" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: "8px 20px",
        borderRadius: "50px",
        fontSize: "1rem",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("فشل النسخ:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="section-container" style={{ maxWidth: "800px" }}>
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem" }}>
          🔍 التحقق من الحجز
        </h1>
        <div style={{ 
          width: "80px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "15px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ color: "var(--gray-600)", fontSize: "1.1rem" }}>
          أدخل رقم الحجز للتحقق من موعدك وتفاصيله
        </p>
      </div>

      {/* بطاقة البحث */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <div style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap"
        }}>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gray-400)",
                fontSize: "1.2rem"
              }}>
                🔑
              </span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: CL-260321-4821"
                style={{
                  width: "100%",
                  padding: "15px 45px 15px 15px",
                  borderRadius: "12px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "monospace",
                  direction: "ltr"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>
          </div>
          
          <button 
            onClick={() => search(code)} 
            style={{
              padding: "15px 30px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span>🔍</span>
            تحقق
          </button>
        </div>

        {/* مثال على رقم الحجز */}
        <div style={{
          marginTop: "15px",
          padding: "10px",
          background: "var(--gray-50)",
          borderRadius: "8px",
          fontSize: "0.9rem",
          color: "var(--gray-600)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "1.2rem" }}>💡</span>
          <span>رقم الحجز يبدأ بـ CL- متبوعاً بالتاريخ ورقم عشوائي</span>
        </div>
      </div>

      {/* حالة التحميل */}
      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⏳</div>
          <p style={{ color: "var(--gray-600)" }}>جاري التحقق من رقم الحجز...</p>
        </div>
      )}

      {/* رسائل النجاح/الخطأ */}
      {msg && !loading && (
        <div className="card" style={{
          padding: "15px",
          backgroundColor: msg.type === "error" ? "#fee2e2" : 
                         msg.type === "success" ? "#d1fae5" : "#e2e3e5",
          color: msg.type === "error" ? "#991b1b" : 
                msg.type === "success" ? "#065f46" : "#1e3a8a",
          border: "none",
          textAlign: "center",
          fontSize: "1.1rem"
        }}>
          {msg.text}
        </div>
      )}

      {/* نتيجة البحث */}
      {result && !loading && (
        <div className="card" style={{ 
          marginTop: "20px",
          border: "2px solid var(--primary-light)"
        }}>
          <h3 style={{ 
            color: "var(--primary-dark)", 
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>📋</span>
            تفاصيل الحجز
          </h3>

          {/* شريط الحالة */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px"
          }}>
            {getStatusBadge(result.status)}
          </div>

          {/* تفاصيل الحجز */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>🔢</div>
              <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>رقم الحجز</div>
              <div style={{ 
                fontSize: "1.2rem", 
                fontWeight: "bold", 
                color: "var(--primary-dark)",
                fontFamily: "monospace",
                direction: "ltr"
              }}>
                {result.booking_number}
              </div>
            </div>

            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--secondary)" }}>📅</div>
              <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>التاريخ</div>
              <div style={{ 
                fontSize: "1.1rem", 
                fontWeight: "bold", 
                color: "var(--primary-dark)"
              }}>
                {formatDate(result.appointment_date)}
              </div>
            </div>

            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px", color: "#10b981" }}>⏰</div>
              <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>الوقت</div>
              <div style={{ 
                fontSize: "1.3rem", 
                fontWeight: "bold", 
                color: "var(--primary-dark)"
              }}>
                {result.appointment_time}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div style={{
            background: "linear-gradient(135deg, var(--gray-50), white)",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            border: "2px dashed var(--primary-light)",
            marginBottom: "20px"
          }}>
            <div style={{ marginBottom: "15px" }}>
              <span style={{
                background: "var(--primary)",
                color: "white",
                padding: "5px 15px",
                borderRadius: "50px",
                fontSize: "0.9rem"
              }}>
                📱 QR Code
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px"
            }}>
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "15px",
                boxShadow: "var(--shadow-md)",
                display: "inline-block"
              }}>
                <QRCodeCanvas value={verifyUrl} size={200} level="H" />
              </div>
            </div>
            
            <p style={{ color: "var(--gray-600)", fontSize: "0.95rem", marginBottom: "15px" }}>
              امسح الـ QR كود لفتح صفحة التحقق مباشرة
            </p>

            {/* رابط التحقق */}
            <div style={{
              background: "var(--gray-100)",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              direction: "ltr"
            }}>
              <code style={{
                flex: 1,
                fontSize: "0.85rem",
                color: "var(--primary-dark)",
                wordBreak: "break-all"
              }}>
                {verifyUrl}
              </code>
              <button
                onClick={() => copyToClipboard(verifyUrl)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: copied ? "#10b981" : "var(--primary)",
                  padding: "5px"
                }}
                title="نسخ الرابط"
              >
                {copied ? "✅" : "📋"}
              </button>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: "12px 25px",
                borderRadius: "50px",
                border: "2px solid var(--primary)",
                background: "transparent",
                color: "var(--primary)",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              🖨️ طباعة التفاصيل
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `📋 تفاصيل الحجز:\n` +
                `رقم الحجز: ${result.booking_number}\n` +
                `التاريخ: ${formatDate(result.appointment_date)}\n` +
                `الوقت: ${result.appointment_time}\n` +
                `الحالة: ${result.status}\n` +
                `رابط التحقق: ${verifyUrl}`
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "12px 25px",
                borderRadius: "50px",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              📱 إرسال عبر واتساب
            </a>
          </div>
        </div>
      )}

      {/* تعليمات سريعة */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h4 style={{ color: "var(--primary-dark)", marginBottom: "15px" }}>
          📌 ماذا يمكنك أن تفعل؟
        </h4>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.5rem" }}>🔍</span>
            <span style={{ color: "var(--gray-600)" }}>التحقق من حالة الحجز</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.5rem" }}>📱</span>
            <span style={{ color: "var(--gray-600)" }}>حفظ QR كود للرجوع إليه</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.5rem" }}>📲</span>
            <span style={{ color: "var(--gray-600)" }}>مشاركة التفاصيل عبر واتساب</span>
          </div>
        </div>
      </div>

      {/* رابط الحجز السريع */}
      <div className="card" style={{ 
        marginTop: "20px",
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        color: "white",
        textAlign: "center"
      }}>
        <p style={{ color: "white", marginBottom: "15px", fontSize: "1.1rem" }}>
          ليس لديك حجز بعد؟
        </p>
        <a
          href="/book"
          style={{
            display: "inline-block",
            padding: "12px 30px",
            background: "white",
            color: "var(--primary)",
            textDecoration: "none",
            borderRadius: "50px",
            fontWeight: "600"
          }}
        >
          احجز موعدك الآن
        </a>
      </div>
    </div>
  );
}