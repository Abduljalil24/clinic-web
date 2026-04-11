"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type SubmitStatus = {
  type: "success" | "error" | null;
  message: string;
};

const clinicInfo = {
  name: "مركز آسيا الطبي",
  fullAddress: "شارع خولان - خلف الجوازات",
  city: "صنعاء",
  country: "اليمن",
  phone: "777276243",
  email: "info@asia-clinic.com",
  mapsLink: "https://maps.app.goo.gl/ypWsFu9jToJoSrzo7",
  coordinates: "15.3694,44.1910",
};

const workSchedule = [
  { day: "السبت", time: "11:00 ص - 9:00 م" },
  { day: "الأحد", time: "3:00 م - 10:00 م" },
  { day: "الاثنين", time: "عطلة" },
  { day: "الثلاثاء", time: "3:00 م - 10:00 م" },
  { day: "الأربعاء", time: "11:00 ص - 9:00 م" },
  { day: "الخميس", time: "عطلة" },
  { day: "الجمعة", time: "عطلة" },
];

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: "26px" }}>
      <h1 style={{ marginBottom: "10px" }}>{title}</h1>
      {subtitle && (
        <p
          style={{
            color: "var(--text-soft)",
            maxWidth: "760px",
            margin: "0 auto",
            lineHeight: 1.9,
            fontSize: "1.02rem",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CardTitle({
  title,
  icon,
}: {
  title: string;
  icon?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          width: "5px",
          height: "28px",
          borderRadius: "999px",
          background: "linear-gradient(180deg, var(--primary), var(--secondary))",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          color: "var(--primary)",
          fontSize: "1.25rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </div>
    </div>
  );
}

function QuickInfoCard({
  icon,
  title,
  text,
  subtext,
  href,
  accent,
}: {
  icon: string;
  title: string;
  text: string;
  subtext?: string;
  href?: string;
  accent?: string;
}) {
  const content = (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "22px 18px",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "22px",
          margin: "0 auto 16px",
          background: accent
            ? `${accent}18`
            : "linear-gradient(135deg, rgba(139,0,0,0.10), rgba(139,0,0,0.04))",
          border: `1px solid ${accent ? `${accent}30` : "rgba(139,0,0,0.12)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "var(--primary)",
          fontWeight: 800,
          fontSize: "1.05rem",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: accent || "var(--text)",
          fontWeight: 700,
          lineHeight: 1.8,
          direction: href?.startsWith("tel:") || href?.startsWith("mailto:") ? "ltr" : "rtl",
          marginBottom: subtext ? "6px" : 0,
        }}
      >
        {text}
      </div>

      {subtext && (
        <div
          style={{
            color: "var(--text-soft)",
            fontSize: "0.92rem",
            lineHeight: 1.7,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const whatsappNumber = useMemo(
    () => clinicInfo.phone.replace(/\D/g, ""),
    []
  );

  const mapEmbedSrc = useMemo(() => {
    if (!clinicInfo.coordinates) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(
      clinicInfo.coordinates
    )}&z=15&output=embed`;
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          status: "unread",
        },
      ]);

      if (error) throw error;

      setSubmitStatus({
        type: "success",
        message: "تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: `حدث خطأ أثناء الإرسال: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  }

  return (
    <div className="section-container">
      <SectionHeader
        title="تواصل معنا"
        subtitle="يمكنك التواصل معنا مباشرة عبر الهاتف أو الواتساب أو إرسال رسالة من خلال النموذج أدناه، وسنقوم بالرد عليك في أقرب وقت ممكن."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <QuickInfoCard
          icon="📞"
          title="اتصال هاتفي"
          text={clinicInfo.phone}
          subtext="للاستفسار والحجز"
          href={`tel:${clinicInfo.phone}`}
        />

        <QuickInfoCard
          icon="📱"
          title="واتساب"
          text={clinicInfo.phone}
          subtext="تواصل مباشر عبر الواتساب"
          href={`https://wa.me/967${whatsappNumber}`}
          accent="#25D366"
        />

        <QuickInfoCard
          icon="✉️"
          title="البريد الإلكتروني"
          text={clinicInfo.email}
          subtext="للاستفسارات العامة"
          href={`mailto:${clinicInfo.email}`}
        />

        <QuickInfoCard
          icon="📍"
          title="العنوان"
          text={`${clinicInfo.fullAddress}`}
          subtext={`${clinicInfo.city} - ${clinicInfo.country}`}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "20px",
          alignItems: "start",
          marginBottom: "28px",
        }}
      >
        {/* نموذج التواصل */}
        <div className="card" style={{ textAlign: "right", padding: "24px" }}>
          <CardTitle title="أرسل لنا رسالة" icon="📝" />

          {submitStatus.type && (
            <div
              style={{
                marginBottom: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background:
                  submitStatus.type === "success" ? "#dcfce7" : "#fee2e2",
                color:
                  submitStatus.type === "success" ? "#166534" : "#991b1b",
                fontWeight: 700,
                lineHeight: 1.8,
              }}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "14px" }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="الاسم الكامل"
                required
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="رقم الجوال"
                required
                dir="ltr"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="البريد الإلكتروني (اختياري)"
                dir="ltr"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">اختر الموضوع</option>
                <option value="استفسار عام">استفسار عام</option>
                <option value="حجز موعد">حجز موعد</option>
                <option value="استفسار عن خدمة">استفسار عن خدمة</option>
                <option value="شكوى">شكوى</option>
                <option value="اقتراح">اقتراح</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب رسالتك هنا..."
                required
                rows={5}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  fontWeight: 800,
                  fontSize: "1.02rem",
                }}
              >
                {isSubmitting ? "⏳ جاري الإرسال..." : "إرسال الرسالة"}
              </button>
            </div>
          </form>
        </div>

        {/* المعلومات الجانبية */}
        <div style={{ display: "grid", gap: "20px" }}>
          <div className="card" style={{ textAlign: "right", padding: "24px" }}>
            <CardTitle title="موقع المركز" icon="📍" />

            <div
              style={{
                color: "var(--text)",
                fontWeight: 700,
                marginBottom: "8px",
                lineHeight: 1.8,
              }}
            >
              {clinicInfo.name}
            </div>

            <div
              style={{
                color: "var(--text-soft)",
                lineHeight: 1.9,
                marginBottom: "16px",
              }}
            >
              {clinicInfo.fullAddress}
              <br />
              {clinicInfo.city} - {clinicInfo.country}
            </div>

            {mapEmbedSrc && (
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  marginBottom: "16px",
                  background: "var(--bg-soft)",
                }}
              >
                <iframe
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <a
                href={clinicInfo.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                style={actionButtonStyle("primary")}
              >
                فتح في الخرائط
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `موقع ${clinicInfo.name}: ${clinicInfo.fullAddress} - ${clinicInfo.city} - ${clinicInfo.country}\n${clinicInfo.mapsLink}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={actionButtonStyle("whatsapp")}
              >
                مشاركة الموقع
              </a>
            </div>
          </div>

          <div className="card" style={{ textAlign: "right", padding: "24px" }}>
            <CardTitle title="مواعيد العمل" icon="⏰" />

            <div style={{ display: "grid", gap: "10px" }}>
              {workSchedule.map((item) => (
                <div
                  key={item.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: "1px dashed rgba(0,0,0,0.08)",
                  }}
                >
                  <span style={{ color: "var(--text)", fontWeight: 700 }}>
                    {item.day}
                  </span>
                  <span
                    style={{
                      color:
                        item.time === "عطلة" ? "var(--secondary)" : "var(--primary)",
                      fontWeight: 700,
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              ⏸️ وقت الراحة اليومي: 2:00 م - 3:00 م
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ textAlign: "center", padding: "24px" }}>
        <CardTitle title="روابط سريعة" icon="🔗" />

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link href="/" style={quickLinkStyle}>
            الرئيسية
          </Link>
          <Link href="/about" style={quickLinkStyle}>
            الطبيبات
          </Link>
          <Link href="/services" style={quickLinkStyle}>
            خدمات العيادة
          </Link>
          <Link href="/lab" style={quickLinkStyle}>
            خدمات المختبر
          </Link>
          <Link href="/book" style={quickLinkStyle}>
            حجز موعد
          </Link>
          <Link href="/verify" style={quickLinkStyle}>
            التحقق من الحجز
          </Link>
        </div>
      </div>
    </div>
  );
}

function actionButtonStyle(type: "primary" | "whatsapp"): React.CSSProperties {
  if (type === "whatsapp") {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 20px",
      borderRadius: "999px",
      background: "#25D366",
      color: "white",
      textDecoration: "none",
      fontWeight: 700,
      minWidth: "150px",
    };
  }

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 20px",
    borderRadius: "999px",
    background: "var(--primary)",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
    minWidth: "150px",
  };
}

const quickLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 20px",
  borderRadius: "999px",
  background: "var(--bg-soft)",
  border: "1px solid var(--border)",
  color: "var(--primary)",
  textDecoration: "none",
  fontWeight: 700,
};