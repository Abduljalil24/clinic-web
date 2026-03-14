"use client";

import { useState } from "react";
import Link from "next/link";
import { Cairo } from "next/font/google";
import { supabase } from "../../lib/supabaseClient";

const cairo = Cairo({ subsets: ["arabic"] });

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // إدخال البيانات في قاعدة البيانات
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            status: 'unread' // الحالة الافتراضية: غير مقروء
          }
        ]);

      if (error) {
        throw error;
      }

      // نجاح الإرسال
      setSubmitStatus({
        type: "success",
        message: "✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."
      });
      
      // تفريغ النموذج
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
    } catch (error: any) {
      console.error("خطأ في إرسال الرسالة:", error);
      setSubmitStatus({
        type: "error",
        message: `❌ حدث خطأ في الإرسال: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
      
      // إخفاء الرسالة بعد 5 ثوان
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  // معلومات المركز مع العنوان الصحيح
  const clinicLocation = {
    name: "مركز أسيا الطبي",
    fullAddress: "شارع خولان - خلف الجوازات",
    city: "صنعاء",
    country: "اليمن",
    phone: "05xxxxxxxx",
    mapsLink: "https://maps.app.goo.gl/ypWsFu9jToJoSrzo7",
    // يمكنك تحديث الإحداثيات إذا كان لديك الموقع الدقيق
    coordinates: "15.3694,44.1910"
  };

  return (
    <div className="section-container">
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.8rem" }}>
          📞 تواصل معنا
        </h1>
        <div style={{ 
          width: "100px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "20px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ fontSize: "1.2rem", color: "var(--gray-600)", maxWidth: "700px", margin: "0 auto" }}>
          نحن هنا للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا بأي من الطرق التالية
        </p>
      </div>

      {/* بطاقات الاتصال السريع */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
        marginBottom: "50px"
      }}>
        {/* الهاتف */}
        <div className="card" style={{ textAlign: "center", padding: "30px 20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, var(--primary-light), var(--primary))",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "2.5rem",
            color: "white"
          }}>
            📞
          </div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>اتصال هاتفي</h3>
          <p style={{ color: "var(--gray-600)", marginBottom: "5px" }}>للاستفسار والحجز</p>
          <a 
            href={`tel:${clinicLocation.phone}`} 
            style={{
              color: "var(--primary)",
              fontSize: "1.3rem",
              fontWeight: "bold",
              textDecoration: "none",
              direction: "ltr",
              display: "block"
            }}
          >
            {clinicLocation.phone}
          </a>
          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "5px" }}>متاح 9ص - 8م</p>
        </div>

        {/* واتساب */}
        <div className="card" style={{ textAlign: "center", padding: "30px 20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "#25D366",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "2.5rem",
            color: "white"
          }}>
            📱
          </div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>واتساب</h3>
          <p style={{ color: "var(--gray-600)", marginBottom: "5px" }}>تواصل مباشر عبر الواتساب</p>
          <a 
            href={`https://wa.me/967${clinicLocation.phone.replace(/\D/g, '')}`} 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#25D366",
              fontSize: "1.3rem",
              fontWeight: "bold",
              textDecoration: "none",
              direction: "ltr",
              display: "block"
            }}
          >
            {clinicLocation.phone}
          </a>
          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "5px" }}>رد سريع خلال ساعة</p>
        </div>

        {/* العنوان */}
        <div className="card" style={{ textAlign: "center", padding: "30px 20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, var(--secondary), #F59E0B)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "2.5rem",
            color: "white"
          }}>
            📍
          </div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>العنوان</h3>
          <p style={{ color: "var(--gray-600)", marginBottom: "5px" }}>{clinicLocation.fullAddress}</p>
          <p style={{ color: "var(--gray-700)", fontWeight: "500" }}>{clinicLocation.city} - {clinicLocation.country}</p>
          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "5px" }}>السبت - الأربعاء</p>
        </div>
      </div>

      {/* الخريطة + نموذج الاتصال */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "50px"
      }}>
        {/* نموذج الاتصال */}
        <div className="card" style={{ padding: "35px" }}>
          <h3 style={{ 
            color: "var(--primary-dark)", 
            fontSize: "1.8rem",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>✉️</span> أرسل لنا رسالة
          </h3>

          {submitStatus.type && (
            <div style={{
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              backgroundColor: submitStatus.type === "success" ? "#d1fae5" : "#fee2e2",
              color: submitStatus.type === "success" ? "#065f46" : "#991b1b",
              textAlign: "center",
              fontSize: "1rem"
            }}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* الاسم */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--gray-700)",
                fontWeight: "600"
              }}>
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="أدخل اسمك الكامل"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>

            {/* رقم الجوال */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--gray-700)",
                fontWeight: "600"
              }}>
                رقم الجوال
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="05xxxxxxxx"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  direction: "ltr"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>

            {/* البريد الإلكتروني (اختياري) */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--gray-700)",
                fontWeight: "600"
              }}>
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  direction: "ltr"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>

            {/* الموضوع */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--gray-700)",
                fontWeight: "600"
              }}>
                الموضوع
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  backgroundColor: "white"
                }}
              >
                <option value="">اختر الموضوع</option>
                <option value="استفسار عام">استفسار عام</option>
                <option value="حجز موعد">حجز موعد</option>
                <option value="استفسار عن خدمة">استفسار عن خدمة</option>
                <option value="شكوى">شكوى</option>
                <option value="اقتراح">اقتراح</option>
              </select>
            </div>

            {/* الرسالة */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--gray-700)",
                fontWeight: "600"
              }}>
                الرسالة
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="اكتب رسالتك هنا..."
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "none",
                background: isSubmitting ? "var(--gray-400)" : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {isSubmitting ? "⏳ جاري الإرسال..." : "📨 إرسال الرسالة"}
            </button>
          </form>
        </div>

        {/* الخريطة */}
        <div>
          <div className="card" style={{ padding: "0", overflow: "hidden", height: "100%" }}>
            <h3 style={{ 
              color: "var(--primary-dark)", 
              fontSize: "1.8rem",
              padding: "35px 35px 20px 35px",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>📍</span> {clinicLocation.name}
            </h3>

            {/* العنوان الصحيح يظهر هنا مباشرة */}
            <div style={{
              padding: "0 35px 20px 35px",
              color: "var(--primary)",
              fontSize: "1.1rem",
              fontWeight: "500"
            }}>
              {clinicLocation.fullAddress} - {clinicLocation.city} - {clinicLocation.country}
            </div>

            {/* خريطة جوجل */}
            <div style={{ 
              width: "100%", 
              height: "300px",
              marginTop: "0"
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.456789012345!2d44.1910!3d15.3694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIyJzA5LjgiTiA0NMKwMTEnMjcuNiJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* معلومات العنوان التفصيلية */}
            <div style={{ 
              padding: "25px 35px 35px 35px",
              background: "var(--gray-50)"
            }}>
              <h4 style={{ color: "var(--primary-dark)", marginBottom: "15px" }}>العنوان التفصيلي:</h4>
              <p style={{ color: "var(--gray-700)", lineHeight: "1.8", marginBottom: "20px", fontSize: "1.05rem" }}>
                <strong>{clinicLocation.name}</strong><br />
                {clinicLocation.fullAddress}<br />
                {clinicLocation.city} - {clinicLocation.country}
              </p>

              <div style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap"
              }}>
                <a 
                  href={clinicLocation.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 25px",
                    background: "var(--primary)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "50px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  🗺️ فتح في خرائط جوجل
                </a>

                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`موقع ${clinicLocation.name}: ${clinicLocation.fullAddress}، ${clinicLocation.city} - ${clinicLocation.country}\n\nرابط الموقع: ${clinicLocation.mapsLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 25px",
                    background: "#25D366",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "50px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  📱 مشاركة الموقع
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "25px",
        marginBottom: "50px"
      }}>
        {/* مواعيد العمل */}
        <div className="card">
          <h4 style={{ 
            color: "var(--primary-dark)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>⏰</span> مواعيد العمل
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>السبت:</span>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>11ص - 9م</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>الأحد:</span>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>3م - 10م</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>الاثنين:</span>
              <span style={{ color: "var(--secondary)" }}>عطلة</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>الثلاثاء:</span>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>3م - 10م</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>الأربعاء:</span>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>11ص - 9م</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--gray-200)"
            }}>
              <span>الخميس:</span>
              <span style={{ color: "var(--secondary)" }}>عطلة</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0"
            }}>
              <span>الجمعة:</span>
              <span style={{ color: "var(--secondary)" }}>عطلة</span>
            </div>
            <div style={{ 
              marginTop: "15px", 
              padding: "10px",
              background: "#fef3c7",
              borderRadius: "8px",
              fontSize: "0.95rem",
              color: "#92400e",
              textAlign: "center"
            }}>
              <span style={{ fontWeight: "bold" }}>⏸️ وقت الراحة:</span> 2:00 م - 3:00 م
            </div>
          </div>
        </div>

        {/* معلومات الاتصال الإضافية */}
        <div className="card">
          <h4 style={{ 
            color: "var(--primary-dark)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>📱</span> معلومات الاتصال
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>📞</span>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>هاتف</div>
                  <a href={`tel:${clinicLocation.phone}`} style={{ color: "var(--primary)", textDecoration: "none", direction: "ltr", display: "block" }}>
                    {clinicLocation.phone}
                  </a>
                </div>
              </div>
            </div>

            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>📱</span>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>واتساب</div>
                  <a 
                    href={`https://wa.me/967${clinicLocation.phone.replace(/\D/g, '')}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#25D366", textDecoration: "none", direction: "ltr", display: "block" }}
                  >
                    {clinicLocation.phone}
                  </a>
                </div>
              </div>
            </div>

            <div style={{
              background: "var(--gray-50)",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>✉️</span>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>بريد إلكتروني</div>
                  <a href="mailto:info@asia-clinic.com" style={{ color: "var(--primary)", textDecoration: "none", direction: "ltr", display: "block" }}>
                    info@asia-clinic.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* طرق الدفع */}
        <div className="card">
          <h4 style={{ 
            color: "var(--primary-dark)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>💳</span> طرق الدفع
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "var(--gray-50)", borderRadius: "10px" }}>
              <span style={{ fontSize: "2rem" }}>💵</span>
              <div>
                <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>نقداً</div>
                <small style={{ color: "var(--gray-600)" }}>ريال يمني / دولار</small>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "var(--gray-50)", borderRadius: "10px" }}>
              <span style={{ fontSize: "2rem" }}>💳</span>
              <div>
                <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>بطاقات بنكية</div>
                <small style={{ color: "var(--gray-600)" }}>فيزا - ماستركارد</small>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "var(--gray-50)", borderRadius: "10px" }}>
              <span style={{ fontSize: "2rem" }}>📱</span>
              <div>
                <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>محافظ إلكترونية</div>
                <small style={{ color: "var(--gray-600)" }}>محفظتي - كاش</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* روابط سريعة */}
      <div className="card" style={{ 
        textAlign: "center",
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        color: "white"
      }}>
        <h4 style={{ color: "white", marginBottom: "20px" }}>روابط سريعة</h4>
        <div style={{
          display: "flex",
          gap: "25px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link href="/" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>الرئيسية</Link>
          <Link href="/about" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>عن الطبيبة</Link>
          <Link href="/services" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>الخدمات</Link>
          <Link href="/lab" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>المختبر</Link>
          <Link href="/book" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>حجز موعد</Link>
          <Link href="/verify" style={{ color: "white", textDecoration: "none", opacity: 0.9}}>التحقق من الحجز</Link>
        </div>
      </div>
    </div>
  );
}