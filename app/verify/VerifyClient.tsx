"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Result = {
  booking_number: string;
  appointment_date: string;
};

export default function VerifyPage() {
  const params = useSearchParams();
  const initial = params.get("code") ?? "";

  const [code, setCode] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const normalizedCode = useMemo(() => code.trim(), [code]);

  const search = async (bookingCode: string) => {
    setMsg(null);
    setResult(null);

    if (!bookingCode.trim()) {
      setMsg({ text: "⚠️ الرجاء إدخال رقم الحجز", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("get_appointment_public", {
        p_booking: bookingCode.trim(),
      });

      if (error) {
        throw error;
      }

      const row = (data?.[0] ?? null) as Record<string, any> | null;

      if (!row) {
        setMsg({ text: "❌ رقم الحجز غير موجود", type: "error" });
        setLoading(false);
        return;
      }

      setResult({
        booking_number: String(row.booking_number ?? ""),
        appointment_date: String(row.appointment_date ?? ""),
      });

      setMsg({ text: "✅ تم العثور على الحجز بنجاح", type: "success" });
    } catch (error: any) {
      setMsg({ text: `❌ تعذر التحقق: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) {
      search(initial);
    }
  }, [initial]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="section-container" style={{ maxWidth: "760px" }}>
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <h1 style={{ marginBottom: "10px" }}>التحقق من الحجز</h1>
        <p
          style={{
            color: "var(--text-soft)",
            fontSize: "1.03rem",
            maxWidth: "620px",
            margin: "0 auto",
            lineHeight: 1.9,
          }}
        >
          أدخل رقم الحجز للتحقق من بيانات الموعد الأساسية.
        </p>
      </div>

      {/* بطاقة البحث */}
      <div className="card" style={{ marginBottom: "24px", padding: "22px" }}>
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  fontSize: "1.1rem",
                }}
              >
                🔑
              </span>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: 11042026-01"
                style={{
                  width: "100%",
                  padding: "15px 45px 15px 15px",
                  borderRadius: "16px",
                  fontSize: "1rem",
                  fontFamily: "monospace",
                  direction: "ltr",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    search(normalizedCode);
                  }
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => search(normalizedCode)}
            style={{
              padding: "15px 26px",
              fontWeight: 800,
              minWidth: "130px",
            }}
          >
            تحقق
          </button>
        </div>

        <div
          style={{
            marginTop: "14px",
            padding: "12px 14px",
            background: "var(--bg-soft)",
            borderRadius: "14px",
            color: "var(--text-soft)",
            fontSize: "0.92rem",
            lineHeight: 1.8,
          }}
        >
          أدخل رقم الحجز كما وصلك بعد تأكيد الموعد.
        </div>
      </div>

      {/* حالة التحميل */}
      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "36px" }}>
          <div style={{ fontSize: "2.7rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "var(--text-soft)", margin: 0 }}>
            جاري التحقق من رقم الحجز...
          </p>
        </div>
      )}

      {/* الرسائل */}
      {msg && !loading && (
        <div
          className="card"
          style={{
            padding: "15px 16px",
            backgroundColor:
              msg.type === "error"
                ? "#fee2e2"
                : msg.type === "success"
                ? "#d1fae5"
                : "#e2e3e5",
            color:
              msg.type === "error"
                ? "#991b1b"
                : msg.type === "success"
                ? "#065f46"
                : "#1e3a8a",
            border: "none",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: result ? "18px" : 0,
          }}
        >
          {msg.text}
        </div>
      )}

      {/* نتيجة البحث */}
      {result && !loading && (
        <div
          className="card"
          style={{
            border: "1px solid rgba(139,0,0,0.12)",
            padding: "24px",
          }}
        >
          <h3
            style={{
              color: "var(--primary)",
              marginBottom: "22px",
              textAlign: "center",
              fontSize: "1.4rem",
            }}
          >
            تفاصيل الحجز
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "var(--bg-soft)",
                padding: "18px",
                borderRadius: "18px",
                textAlign: "center",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "10px",
                  color: "var(--primary)",
                }}
              >
                🔢
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                رقم الحجز
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  fontFamily: "monospace",
                  direction: "ltr",
                }}
              >
                {result.booking_number}
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-soft)",
                padding: "18px",
                borderRadius: "18px",
                textAlign: "center",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "10px",
                  color: "var(--secondary)",
                }}
              >
                📅
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                التاريخ
              </div>
              <div
                style={{
                  fontSize: "1.02rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  lineHeight: 1.8,
                }}
              >
                {formatDate(result.appointment_date)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* رابط الحجز */}
      <div
        className="card"
        style={{
          marginTop: "22px",
          background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          color: "white",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "white",
            marginBottom: "14px",
            fontSize: "1.05rem",
          }}
        >
          ليس لديك حجز بعد؟
        </p>
        <a
          href="/book"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "white",
            color: "var(--primary)",
            textDecoration: "none",
            borderRadius: "999px",
            fontWeight: 700,
          }}
        >
          احجز موعدك الآن
        </a>
      </div>
    </div>
  );
}