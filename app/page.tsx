import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  {
    href: "/services",
    icon: "🩺",
    title: "الخدمات الطبية",
    subtitle: "استعرضي جميع الخدمات المتاحة في العيادة",
  },
  {
    href: "/lab",
    icon: "🧪",
    title: "المختبر",
    subtitle: "تعرفي على خدمات المختبر والفحوصات",
  },
  {
    href: "/about",
    icon: "👩‍⚕️",
    title: "عن الطبيبة",
    subtitle: "تعرفي على خبرة الطبيبة ومعلوماتها",
  },
  {
    href: "/contact",
    icon: "📞",
    title: "تواصل معنا",
    subtitle: "أرسلي استفسارك أو رسالتك بسهولة",
  },
];

const features = [
  {
    icon: "⏰",
    title: "حجز سريع",
    text: "احجزي موعدك خلال دقائق مع عرض الأوقات المتاحة مباشرة.",
  },
  {
    icon: "✅",
    title: "خدمة موثوقة",
    text: "نحرص على تقديم رعاية دقيقة ومتابعة صحية باهتمام كامل.",
  },
  {
    icon: "💬",
    title: "سهولة التواصل",
    text: "يمكنك إرسال استفسارك أو رسالتك في أي وقت عبر الموقع.",
  },
  {
    icon: "🔎",
    title: "تحقق فوري",
    text: "تحققي من حالة الحجز وبيانات الموعد باستخدام رقم الحجز.",
  },
];

const selectedServices = [
  {
    icon: "🤰",
    title: "الاستشارة الطبية",
    text: "استشارات ومتابعات طبية حسب جدول العيادة المعتمد.",
  },
  {
    icon: "🧬",
    title: "الفحوصات المخبرية",
    text: "خدمات مخبرية تساعد في المتابعة والتشخيص بصورة أدق.",
  },
  {
    icon: "💗",
    title: "المتابعة الدورية",
    text: "متابعة الحالات الصحية وفق المواعيد والخطة العلاجية.",
  },
];

export default function HomePage() {
  return (
    <div className="section-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          marginTop: "8px",
          textAlign: "center",
        }}
      >
        <div className="hero-content">
          <div
            style={{
              width: "110px",
              height: "110px",
              margin: "0 auto 22px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              border: "2px solid rgba(255,255,255,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 30px rgba(0,0,0,0.14)",
              overflow: "hidden",
              padding: "10px",
            }}
          >
            <Image
              src="/logo.png"
              alt="شعار مركز آسيا الطبي"
              width={90}
              height={90}
              priority
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%",
                background: "white",
              }}
            />
          </div>

          <h1 style={{ marginBottom: "12px" }}>مركز آسيا الطبي</h1>

          <p
            style={{
              fontSize: "1.1rem",
              maxWidth: "760px",
              margin: "0 auto 26px",
            }}
          >
            رعاية طبية موثوقة، خدمات صحية متكاملة، وحجز مواعيد بسهولة وسرعة.
            نهتم براحتك وخصوصيتك، ونقدم لك تجربة واضحة وهادئة تشبه تمامًا
            تجربة التطبيق.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/book"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 26px",
                borderRadius: "999px",
                background: "white",
                color: "var(--primary)",
                fontWeight: 800,
                boxShadow: "0 12px 24px rgba(0,0,0,0.10)",
                minWidth: "180px",
              }}
            >
              احجزي الآن
            </Link>

            <Link
              href="/verify"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 26px",
                borderRadius: "999px",
                border: "2px solid rgba(255,255,255,0.85)",
                color: "white",
                fontWeight: 800,
                minWidth: "180px",
                background: "transparent",
              }}
            >
              التحقق من الحجز
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section style={{ marginTop: "34px" }}>
        <div style={{ marginBottom: "18px" }}>
          <h2 style={{ marginBottom: "18px" }}>الوصول السريع</h2>
          <p style={{ color: "var(--text-soft)", marginTop: "6px" }}>
            اختاري القسم الذي تريدين الوصول إليه بسرعة
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card"
              style={{
                textAlign: "right",
                padding: "20px",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(135deg, rgba(139,0,0,0.10), rgba(139,0,0,0.04))",
                    border: "1px solid rgba(139,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-soft)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>

                <div
                  style={{
                    color: "var(--primary)",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                  }}
                >
                  ←
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ marginTop: "42px", textAlign: "center" }}>
        <div style={{ marginBottom: "22px" }}>
          <h2 style={{ marginBottom: "18px" }}>لماذا تختارين عيادتنا؟</h2>
          <p style={{ color: "var(--text-soft)" }}>
            نحرص على تقديم تجربة مريحة وموثوقة لكل مراجعة
          </p>
        </div>

        <div className="services-grid">
          {features.map((item, index) => (
            <div key={index} className="card">
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  margin: "0 auto 14px",
                  background:
                    "radial-gradient(circle, rgba(139,0,0,0.14), rgba(139,0,0,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.9rem",
                  border: "1px solid rgba(139,0,0,0.12)",
                }}
              >
                {item.icon}
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Services */}
      <section style={{ marginTop: "46px" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "18px" }}>خدمات مختارة</h2>
          <p style={{ color: "var(--text-soft)" }}>
            بعض الخدمات المهمة التي يمكنك الوصول إليها بسهولة
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "14px",
          }}
        >
          {selectedServices.map((service, index) => (
            <div
              key={index}
              className="card"
              style={{
                textAlign: "right",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, rgba(139,0,0,0.12), rgba(139,0,0,0.05))",
                    border: "1px solid rgba(139,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {service.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {service.title}
                  </div>
                  <div
                    style={{
                      color: "var(--text-soft)",
                      lineHeight: 1.75,
                    }}
                  >
                    {service.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          marginTop: "42px",
          marginBottom: "10px",
          padding: "32px 24px",
          borderRadius: "28px",
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          color: "white",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "10px",
            }}
          >
            جاهزة لحجز موعدك؟
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: "1.05rem",
              marginBottom: "20px",
              lineHeight: 1.9,
            }}
          >
            ابدئي الآن واختاري التاريخ والوقت المناسبين لك بسهولة، أو تحققي من
            موعدك الحالي برقم الحجز.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/book"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "190px",
                padding: "14px 24px",
                borderRadius: "999px",
                background: "white",
                color: "var(--primary)",
                fontWeight: 800,
              }}
            >
              ابدئي الحجز الآن
            </Link>

            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "190px",
                padding: "14px 24px",
                borderRadius: "999px",
                border: "2px solid rgba(255,255,255,0.82)",
                color: "white",
                fontWeight: 800,
              }}
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}