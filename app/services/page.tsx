"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  category?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // تصنيف الخدمات (يمكن تعديلها حسب قاعدة البيانات)
  const categories = [
    "الكل",
    "استشارات نسائية",
    "متابعة حمل",
    "فحوصات",
    "تحاليل مخبرية",
    "خدمات الولادة"
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // تصفية الخدمات حسب الفئة والبحث
    let filtered = [...services];
    
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [services, selectedCategory, searchTerm]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("id,name,description,price,duration_minutes")
      .order("name");

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    // إضافة تصنيف افتراضي للخدمات (يمكن تعديله حسب قاعدة البيانات)
    const servicesWithCategory = (data ?? []).map((service, index) => ({
      ...service,
      category: categories[1 + (index % 4)] // توزيع عشوائي للتصنيفات
    })) as Service[];
    
    setServices(servicesWithCategory);
    setFilteredServices(servicesWithCategory);
    setLoading(false);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "يحدد لاحقاً";
    return new Intl.NumberFormat('ar-YE').format(price) + " ريال";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "استشارات نسائية": "👩‍⚕️",
      "متابعة حمل": "🤰",
      "فحوصات": "🔬",
      "تحاليل مخبرية": "🧪",
      "خدمات الولادة": "👶"
    };
    return icons[category] || "🏥";
  };

  return (
    <div className="section-container">
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem" }}>
          الخدمات والأسعار
        </h1>
        <div style={{ 
          width: "100px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "15px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ color: "var(--gray-600)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          نقدم مجموعة متكاملة من الخدمات الطبية للنساء والأمهات بأعلى معايير الجودة
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
                placeholder="ابحث عن خدمة..."
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
                {getCategoryIcon(cat)} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* حالة التحميل */}
      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⏳</div>
          <p style={{ color: "var(--gray-600)" }}>جاري تحميل الخدمات...</p>
        </div>
      )}

      {/* عرض الأخطاء */}
      {error && (
        <div className="card" style={{ 
          backgroundColor: "#fee2e2", 
          color: "#991b1b",
          border: "none"
        }}>
          <p>❌ {error}</p>
        </div>
      )}

      {/* إحصائيات سريعة */}
      {!loading && !error && filteredServices.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div className="card" style={{ textAlign: "center", padding: "15px" }}>
            <div style={{ fontSize: "2rem", color: "var(--primary)" }}>📋</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
              {filteredServices.length}
            </div>
            <div style={{ color: "var(--gray-600)" }}>خدمة متاحة</div>
          </div>
          
          <div className="card" style={{ textAlign: "center", padding: "15px" }}>
            <div style={{ fontSize: "2rem", color: "var(--secondary)" }}>⏱️</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
              {Math.min(...filteredServices.map(s => s.duration_minutes || 30))}+
            </div>
            <div style={{ color: "var(--gray-600)" }}>أقل مدة (دقيقة)</div>
          </div>
          
          <div className="card" style={{ textAlign: "center", padding: "15px" }}>
            <div style={{ fontSize: "2rem", color: "#10b981" }}>💰</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-dark)" }}>
              {filteredServices.filter(s => s.price).length}
            </div>
            <div style={{ color: "var(--gray-600)" }}>خدمة بسعر محدد</div>
          </div>
        </div>
      )}

      {/* شبكة الخدمات */}
      {!loading && !error && (
        <>
          {filteredServices.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>😕</div>
              <h3 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>لا توجد خدمات</h3>
              <p style={{ color: "var(--gray-600)" }}>
                {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد خدمات في هذه الفئة"}
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px"
            }}>
              {filteredServices.map((service) => (
                <div key={service.id} className="card" style={{
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease"
                }}>
                  {/* شريط علوي ملون حسب الفئة */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
                  }}></div>

                  {/* أيقونة الفئة */}
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    fontSize: "2.5rem",
                    opacity: 0.2
                  }}>
                    {getCategoryIcon(service.category || "")}
                  </div>

                  {/* محتوى الخدمة */}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{ 
                      color: "var(--primary-dark)", 
                      fontSize: "1.4rem",
                      marginBottom: "10px",
                      paddingLeft: "40px"
                    }}>
                      {service.name}
                    </h3>

                    {service.description && (
                      <p style={{ 
                        color: "var(--gray-600)", 
                        lineHeight: "1.7",
                        marginBottom: "20px",
                        borderRight: "3px solid var(--primary-light)",
                        paddingRight: "15px"
                      }}>
                        {service.description}
                      </p>
                    )}

                    {/* تفاصيل السعر والمدة */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                      padding: "15px",
                      background: "var(--gray-50)",
                      borderRadius: "12px"
                    }}>
                      <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginBottom: "5px" }}>
                          💰 السعر
                        </div>
                        <div style={{ 
                          fontSize: "1.2rem", 
                          fontWeight: "bold", 
                          color: "var(--primary-dark)"
                        }}>
                          {formatPrice(service.price)}
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
                          ⏱️ المدة
                        </div>
                        <div style={{ 
                          fontSize: "1.2rem", 
                          fontWeight: "bold", 
                          color: "var(--secondary)"
                        }}>
                          {service.duration_minutes || 30} دقيقة
                        </div>
                      </div>
                    </div>

                    {/* تصنيف الخدمة */}
                    {service.category && (
                      <div style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center"
                      }}>
                        <span style={{
                          background: "var(--gray-100)",
                          color: "var(--gray-600)",
                          padding: "5px 15px",
                          borderRadius: "20px",
                          fontSize: "0.85rem"
                        }}>
                          {getCategoryIcon(service.category)} {service.category}
                        </span>
                      </div>
                    )}

                    {/* زر حجز الخدمة */}
                    <button
                      onClick={() => window.location.href = "/book"}
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid var(--primary)",
                        background: "transparent",
                        color: "var(--primary)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--primary)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--primary)";
                      }}
                    >
                      📅 احجز هذه الخدمة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* معلومات إضافية */}
      <div className="card" style={{ 
        marginTop: "40px",
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        color: "white",
        textAlign: "center"
      }}>
        <h3 style={{ color: "white", marginBottom: "20px" }}>📞 هل لديك استفسار؟</h3>
        <p style={{ color: "white", marginBottom: "20px", opacity: 0.9 }}>
          فريقنا جاهز للإجابة على جميع استفساراتك حول الخدمات والأسعار
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="tel:0123456789" style={{
            padding: "12px 25px",
            background: "white",
            color: "var(--primary)",
            textDecoration: "none",
            borderRadius: "50px",
            fontWeight: "600"
          }}>
            📞 0123456789
          </a>
          <a href="/contact" style={{
            padding: "12px 25px",
            background: "transparent",
            color: "white",
            textDecoration: "none",
            borderRadius: "50px",
            fontWeight: "600",
            border: "2px solid white"
          }}>
            ✉️ تواصل معنا
          </a>
        </div>
      </div>
    </div>
  );
}