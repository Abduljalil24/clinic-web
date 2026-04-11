"use client";

import { useState } from "react";
import Link from "next/link";

type ManualServiceCategory = {
  title: string;
  icon: string;
  items: string[];
};

const PRIMARY = "#8B0000";
const BG_ITEM = "#FDF9F6";

const manualCategories: ManualServiceCategory[] = [
  {
    title: "خدمات متابعة الحمل",
    icon: "🤰",
    items: [
      "تشخيص وتأكيد الحمل المبكر",
      "متابعة الحمل الدوري بالسونار والفحوصات",
      "متابعة نمو الجنين ونبضه",
      "متابعة ضغط الدم وسكر الحمل",
      "متابعة حالات الحمل عالي الخطورة",
      "علاج مشاكل الحمل مثل النزيف أو الالتهابات",
      "تحديد موعد وطريقة الولادة المناسبة",
    ],
  },
  {
    title: "خدمات الولادة",
    icon: "👶",
    items: ["إجراء الولادة القيصرية", "علاج النزيفات بعد الولادة"],
  },
  {
    title: "خدمات أمراض النساء",
    icon: "👩",
    items: [
      "تشخيص وعلاج اضطرابات الدورة الشهرية",
      "تشخيص وعلاج تكيس المبايض",
      "علاج الالتهابات المهبلية والرحمية",
      "علاج النزيف الرحمي غير الطبيعي",
      "تشخيص وعلاج آلام الحوض",
      "تقييم وعلاج تأخر الحمل والعقم",
    ],
  },
  {
    title: "تنظيم الأسرة",
    icon: "👨‍👩‍👧",
    items: [
      "تركيب وإزالة اللولب",
      "وصف حبوب منع الحمل",
      "الاستشارة حول أفضل وسيلة مناسبة",
    ],
  },
  {
    title: "الفحوصات النسائية",
    icon: "🩺",
    items: [
      "فحص السونار للرحم والمبايض",
      "السونار لمتابعة الحمل",
      "مسحة عنق الرحم (Pap smear)",
      "فحص الثدي",
      "طلب وتقييم الفحوصات الهرمونية",
    ],
  },
  {
    title: "العمليات النسائية",
    icon: "🏥",
    items: [
      "إزالة أكياس المبيض",
      "استئصال الرحم",
      "فك الالتصاقات",
      "عمليات هبوط الرحم",
      "تنظيف الرحم",
    ],
  },
  {
    title: "الاستشارات الصحية",
    icon: "💚",
    items: [
      "صحة المرأة قبل الزواج",
      "متابعة سن اليأس",
      "علاج اضطرابات الهرمونات",
      "التوعية بسرطان الثدي وعنق الرحم",
    ],
  },
];

function SectionTitle({ title, icon }: { title: string; icon: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "14px",
          background: "rgba(139,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "1.35rem",
          fontWeight: 800,
          color: PRIMARY,
        }}
      >
        {title}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="card"
      style={{
        marginTop: "14px",
        padding: "28px",
        borderRadius: "22px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔎</div>
      <div
        style={{
          fontSize: "1.15rem",
          color: "var(--text)",
          fontWeight: 800,
          marginBottom: "8px",
        }}
      >
        لا توجد نتائج مطابقة
      </div>
      <div
        style={{
          color: "var(--text-soft)",
          fontSize: "0.95rem",
        }}
      >
        جرّب البحث باسم خدمة أخرى
      </div>
    </div>
  );
}

function ServiceItem({ item }: { item: string }) {
  return (
    <div
      style={{
        marginBottom: "8px",
        padding: "12px 14px",
        background: BG_ITEM,
        borderRadius: "16px",
        border: "1px solid rgba(139,0,0,0.08)",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <div
        style={{
          color: PRIMARY,
          fontSize: "1rem",
          lineHeight: 1.6,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div
        style={{
          color: "var(--text)",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          fontWeight: 500,
        }}
      >
        {item}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  open,
  onToggle,
}: {
  category: ManualServiceCategory;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: "14px",
        background: "white",
        borderRadius: "22px",
        boxShadow: "0 5px 12px rgba(0,0,0,0.03)",
        overflow: "hidden",
        border: "1px solid rgba(139,0,0,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          background: "white",
          color: "inherit",
          boxShadow: "none",
          border: "none",
          borderRadius: 0,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textAlign: "right",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(139,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            flexShrink: 0,
          }}
        >
          {category.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 800,
              color: PRIMARY,
              fontSize: "1.05rem",
              marginBottom: "4px",
            }}
          >
            {category.title}
          </div>
          <div
            style={{
              color: "var(--text-soft)",
              fontSize: "0.86rem",
              fontWeight: 600,
            }}
          >
            {category.items.length} خدمة
          </div>
        </div>

        <div
          style={{
            color: PRIMARY,
            fontSize: "1.1rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        >
          ⌄
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: "0 14px 14px 14px",
          }}
        >
          {category.items.map((item) => (
            <ServiceItem key={`${category.title}-${item}`} item={item} />
          ))}

          <div style={{ marginTop: "10px" }}>
            <Link
              href="/book"
              style={{
                display: "inline-flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 22px",
                borderRadius: "999px",
                background: PRIMARY,
                color: "white",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              <span>📅</span>
              احجز الآن
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  const filteredManualCategories =
    searchQuery.trim() === ""
      ? manualCategories
      : manualCategories
          .map((category) => {
            const filteredItems = category.items.filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (category.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return category;
            }

            return {
              ...category,
              items: filteredItems,
            };
          })
          .filter((category) => category.items.length > 0);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="section-container" style={{ maxWidth: "980px" }}>
      {/* البحث */}
      <div
        style={{
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: PRIMARY,
                fontSize: "1.1rem",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن خدمة..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "white",
                padding: "16px 48px 16px 48px",
                fontSize: "1rem",
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  padding: 0,
                  background: "transparent",
                  color: "var(--text-soft)",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* عنوان القسم */}
      <SectionTitle title="خدمات النساء والولادة" icon="💗" />

      {/* المحتوى */}
      {filteredManualCategories.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ marginTop: "12px" }}>
          {filteredManualCategories.map((category) => (
            <CategoryCard
              key={category.title}
              category={category}
              open={!!openCategories[category.title]}
              onToggle={() => toggleCategory(category.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}