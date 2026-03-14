"use client";

import { useState } from "react";

type LabTest = {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation: string;
  category: string;
  duration: string;
  results_time: string;
};

export default function LabPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات تحاليل المختبر
  const labTests: LabTest[] = [
    {
      id: "1",
      name: "تحليل السكر (صائم)",
      description: "قياس مستوى الجلوكوز في الدم بعد الصيام لمدة 8 ساعات",
      price: 3000,
      preparation: "الصيام لمدة 8-10 ساعات قبل التحليل",
      category: "تحاليل السكر",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "2",
      name: "تحليل السكر (فاطر)",
      description: "قياس مستوى الجلوكوز بعد الأكل بساعتين",
      price: 2500,
      preparation: "تناول وجبة عادية قبل التحليل بساعتين",
      category: "تحاليل السكر",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "3",
      name: "تحليل السكر التراكمي (HbA1c)",
      description: "قياس متوسط مستوى السكر خلال آخر 3 أشهر",
      price: 5000,
      preparation: "لا يحتاج لصيام",
      category: "تحاليل السكر",
      duration: "10 دقائق",
      results_time: "24 ساعة"
    },
    {
      id: "4",
      name: "صورة الدم الكاملة (CBC)",
      description: "تحليل شامل لخلايا الدم الحمراء والبيضاء والصفائح الدموية",
      price: 4000,
      preparation: "لا يحتاج لصيام",
      category: "تحاليل الدم",
      duration: "10 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "5",
      name: "تحليل الكوليسترول الكلي",
      description: "قياس مستوى الكوليسترول في الدم",
      price: 3500,
      preparation: "الصيام لمدة 9-12 ساعة",
      category: "تحاليل الدهون",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "6",
      name: "تحليل الدهون الثلاثية",
      description: "قياس مستوى الدهون الثلاثية في الدم",
      price: 3500,
      preparation: "الصيام لمدة 9-12 ساعة",
      category: "تحاليل الدهون",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "7",
      name: "تحليل الكوليسترول HDL",
      description: "قياس مستوى الكوليسترول الجيد في الدم",
      price: 4000,
      preparation: "الصيام لمدة 9-12 ساعة",
      category: "تحاليل الدهون",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "8",
      name: "تحليل الكوليسترول LDL",
      description: "قياس مستوى الكوليسترول الضار في الدم",
      price: 4000,
      preparation: "الصيام لمدة 9-12 ساعة",
      category: "تحاليل الدهون",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "9",
      name: "تحليل وظائف الكبد (ALT)",
      description: "قياس إنزيم الكبد ALT للكشف عن أمراض الكبد",
      price: 3000,
      preparation: "يفضل الصيام",
      category: "تحاليل الكبد",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "10",
      name: "تحليل وظائف الكبد (AST)",
      description: "قياس إنزيم الكبد AST للكشف عن أمراض الكبد",
      price: 3000,
      preparation: "يفضل الصيام",
      category: "تحاليل الكبد",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "11",
      name: "تحليل وظائف الكلى (كرياتينين)",
      description: "قياس مستوى الكرياتينين للكشف عن وظائف الكلى",
      price: 2500,
      preparation: "لا يحتاج لصيام",
      category: "تحاليل الكلى",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "12",
      name: "تحليل وظائف الكلى (يوريا)",
      description: "قياس مستوى اليوريا للكشف عن وظائف الكلى",
      price: 2500,
      preparation: "لا يحتاج لصيام",
      category: "تحاليل الكلى",
      duration: "5 دقائق",
      results_time: "ساعتان"
    },
    {
      id: "13",
      name: "تحليل هرمونات الغدة الدرقية (TSH)",
      description: "قياس مستوى هرمون الغدة الدرقية",
      price: 4500,
      preparation: "يفضل الصيام",
      category: "تحاليل الهرمونات",
      duration: "10 دقائق",
      results_time: "24 ساعة"
    },
    {
      id: "14",
      name: "تحليل هرمون الحليب (Prolactin)",
      description: "قياس مستوى هرمون الحليب في الدم",
      price: 5000,
      preparation: "يفضل الصيام والراحة قبل التحليل",
      category: "تحاليل الهرمونات",
      duration: "10 دقائق",
      results_time: "24 ساعة"
    }
  ];

  const categories = ["الكل", ...new Set(labTests.map(test => test.category))];

  const filteredTests = labTests.filter(test => {
    const matchesCategory = selectedCategory === "الكل" || test.category === selectedCategory;
    const matchesSearch = test.name.includes(searchTerm) || 
                         test.description.includes(searchTerm) ||
                         test.category.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE').format(price) + " ريال";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "تحاليل السكر": "🩸",
      "تحاليل الدم": "🔴",
      "تحاليل الدهون": "🧈",
      "تحاليل الكبد": "🫁",
      "تحاليل الكلى": "🧬",
      "تحاليل الهرمونات": "🧪"
    };
    return icons[category] || "🔬";
  };

  return (
    <div className="section-container">
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem" }}>
          🧪 خدمات المختبر
        </h1>
        <div style={{ 
          width: "100px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "15px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ color: "var(--gray-600)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
          مختبر متكامل بأحدث الأجهزة الطبية لتحليل جميع العينات بدقة عالية وسرعة في النتائج
        </p>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <div style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          {/* بحث */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gray-400)"
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="ابحث عن تحليل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 15px",
                  borderRadius: "50px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>
          </div>

          {/* تصفية حسب الفئة */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "50px",
                  border: "none",
                  background: selectedCategory === cat 
                    ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                    : "var(--gray-100)",
                  color: selectedCategory === cat ? "white" : "var(--gray-700)",
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat ? "600" : "400",
                  transition: "all 0.3s ease"
                }}
              >
                {cat !== "الكل" && getCategoryIcon(cat)} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: "var(--primary)" }}>🧪</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
            {labTests.length}
          </div>
          <div style={{ color: "var(--gray-600)" }}>تحليل متاح</div>
        </div>
        
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: "var(--secondary)" }}>⏱️</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
            {categories.length - 1}
          </div>
          <div style={{ color: "var(--gray-600)" }}>فئة مختلفة</div>
        </div>
        
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: "#10b981" }}>📊</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
            ساعتان
          </div>
          <div style={{ color: "var(--gray-600)" }}>متوسط وقت النتيجة</div>
        </div>
      </div>

      {/* شبكة التحاليل */}
      {filteredTests.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔬</div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>لا توجد نتائج</h3>
          <p style={{ color: "var(--gray-600)" }}>
            {searchTerm ? "لا توجد تحاليل تطابق بحثك" : "لا توجد تحاليل في هذه الفئة"}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "25px"
        }}>
          {filteredTests.map((test) => (
            <div key={test.id} className="card" style={{
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s ease",
              padding: "25px"
            }}>
              {/* خلفية الفئة */}
              <div style={{
                position: "absolute",
                top: "-20px",
                left: "-20px",
                fontSize: "8rem",
                opacity: 0.05,
                transform: "rotate(15deg)"
              }}>
                {getCategoryIcon(test.category)}
              </div>

              {/* شريط علوي ملون حسب الفئة */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
              }}></div>

              {/* رأس البطاقة */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{
                  background: "var(--gray-100)",
                  padding: "8px 15px",
                  borderRadius: "50px",
                  fontSize: "0.9rem",
                  color: "var(--primary-dark)"
                }}>
                  {getCategoryIcon(test.category)} {test.category}
                </div>
                <div style={{
                  background: "var(--primary-light)",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "50px",
                  fontSize: "0.85rem"
                }}>
                  {test.duration}
                </div>
              </div>

              {/* اسم التحليل */}
              <h3 style={{ 
                color: "var(--primary-dark)", 
                fontSize: "1.5rem",
                marginBottom: "10px"
              }}>
                {test.name}
              </h3>

              {/* وصف التحليل */}
              <p style={{ 
                color: "var(--gray-600)", 
                lineHeight: "1.7",
                marginBottom: "20px",
                borderRight: "3px solid var(--primary-light)",
                paddingRight: "15px"
              }}>
                {test.description}
              </p>

              {/* التحضيرات */}
              <div style={{
                background: "#fef3c7",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px"
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  color: "#92400e",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  <span>⚠️</span> التحضيرات اللازمة
                </div>
                <p style={{ color: "#92400e", fontSize: "0.95rem", margin: 0 }}>
                  {test.preparation}
                </p>
              </div>

              {/* تفاصيل السعر والنتيجة */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                background: "var(--gray-50)",
                borderRadius: "12px",
                marginBottom: "20px"
              }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>
                    💰 السعر
                  </div>
                  <div style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: "bold", 
                    color: "var(--primary-dark)"
                  }}>
                    {formatPrice(test.price)}
                  </div>
                </div>

                <div style={{ 
                  width: "1px", 
                  height: "40px", 
                  background: "var(--gray-300)",
                  margin: "0 15px"
                }}></div>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>
                    ⏱️ مدة النتيجة
                  </div>
                  <div style={{ 
                    fontSize: "1.1rem", 
                    fontWeight: "bold", 
                    color: "var(--secondary)"
                  }}>
                    {test.results_time}
                  </div>
                </div>
              </div>

              {/* زر حجز التحليل */}
              <button
                onClick={() => window.location.href = "/book"}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                📅 حجز موعد للتحليل
              </button>
            </div>
          ))}
        </div>
      )}

      {/* معلومات المختبر */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "40px"
      }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🕒</div>
          <h4 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>مواعيد العمل</h4>
          <p style={{ color: "var(--gray-600)" }}>السبت - الخميس</p>
          <p style={{ color: "var(--gray-600)" }}>8:00 ص - 8:00 م</p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📞</div>
          <h4 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>للاستفسار</h4>
          <p style={{ color: "var(--gray-600)" }}>هاتف: 0123456789</p>
          <p style={{ color: "var(--gray-600)" }}>واتساب: 0123456789</p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📍</div>
          <h4 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>العنوان</h4>
          <p style={{ color: "var(--gray-600)" }}>شارع المختبر - بجانب المستشفى</p>
          <p style={{ color: "var(--gray-600)" }}>صنعاء - اليمن</p>
        </div>
      </div>

      {/* ملاحظات مهمة */}
      <div className="card" style={{ 
        marginTop: "30px",
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        color: "white"
      }}>
        <h4 style={{ color: "white", marginBottom: "15px", textAlign: "center" }}>
          📌 ملاحظات مهمة
        </h4>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>✅</span> يفضل الحضور صباحاً للتحاليل التي تتطلب صيام
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>✅</span> إحضار وصفة الطبيب إن وجدت
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>✅</span> النتائج ترسل عبر واتساب خلال 24 ساعة
          </div>
        </div>
      </div>
    </div>
  );
}