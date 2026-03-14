"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BookPage() {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const loadSlots = async (d: string) => {
      setLoadingSlots(true);
      setSelectedTime("");
      setMsg(null);

      try {
          const selectedDate = new Date(d);
          const dayNumber = selectedDate.getDay();
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayName = dayNames[dayNumber];
          
          console.log("1. التاريخ:", d);
          console.log("2. اليوم:", dayName);

          // 1. جلب ساعات العمل من قاعدة البيانات
          const { data: workData, error: workError } = await supabase
              .from('working_hours')
              .select('*')
              .eq('day', dayName);

          if (workError) {
              console.error("خطأ في جلب ساعات العمل:", workError);
              setSlots([]);
              return;
          }

          if (!workData || workData.length === 0) {
              console.log("لا يوجد دوام لهذا اليوم");
              setSlots([]);
              return;
          }

          const work = workData[0];
          console.log("3. ساعات العمل:", work);

          // 2. جلب أوقات الاستراحة
          const { data: breaksData } = await supabase
              .from('breaks')
              .select('*')
              .eq('day', dayName);

          console.log("4. أوقات الاستراحة:", breaksData);

          // 3. جلب المواعيد المحجوزة من المرضى
          const { data: bookedData } = await supabase
              .from('appointments')
              .select('appointment_time')
              .eq('appointment_date', d)
              .neq('status', 'cancelled');

          const bookedTimes = (bookedData || []).map(b => 
            b.appointment_time.substring(0,5)
          );
          console.log("5. المواعيد المحجوزة من المرضى:", bookedTimes);

          // ✅ 4. جلب الأوقات المحجوزة يدوياً من الادمن (الجديد)
          const { data: blockedData } = await supabase
              .from('blocked_times')
              .select('*')
              .eq('date', d);

          console.log("6. الأوقات المحجوزة يدوياً من الادمن:", blockedData);

          // 5. توليد المواعيد كل 15 دقيقة
          const startTime = work.start_time;
          const endTime = work.end_time;
          
          console.log("7. وقت البداية:", startTime);
          console.log("8. وقت النهاية:", endTime);
          
          const [startHour, startMin] = startTime.split(':').map(Number);
          const [endHour, endMin] = endTime.split(':').map(Number);
          
          const startTotal = startHour * 60 + (startMin || 0);
          const endTotal = endHour * 60 + (endMin || 0);
          
          console.log("9. بداية بالدقائق:", startTotal);
          console.log("10. نهاية بالدقائق:", endTotal);
          
          const availableSlots = [];
          
          for (let minutes = startTotal; minutes < endTotal; minutes += 15) {
              const hour = Math.floor(minutes / 60);
              const minute = minutes % 60;
              const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              
              // تحقق من وقت الاستراحة
              let isBreak = false;
              if (breaksData && breaksData.length > 0) {
                  for (const b of breaksData) {
                      // معالجة مشكلة end_TIME في جدول breaks
                      const breakEnd = b.end_TIME || b.end_time;
                      if (timeStr >= b.start_time && timeStr < breakEnd) {
                          isBreak = true;
                          break;
                      }
                  }
              }
              
              // تحقق من الحجز (هل هو في قائمة المحجوزات من المرضى؟)
              const isBooked = bookedTimes.includes(timeStr);
              
              // ✅ تحقق من الأوقات المحجوزة يدوياً من الادمن
              let isBlocked = false;
              if (blockedData && blockedData.length > 0) {
                  for (const block of blockedData) {
                      if (timeStr >= block.start_time && timeStr < block.end_time) {
                          isBlocked = true;
                          break;
                      }
                  }
              }
              
              console.log(`11. الوقت ${timeStr}: استراحة? ${isBreak}, محجوز? ${isBooked}, محظور? ${isBlocked}`);
              
              // ✅ إذا لم يكن وقت استراحة وليس محجوز وليس محظور، أضفه
              if (!isBreak && !isBooked && !isBlocked) {
                  availableSlots.push(timeStr);
              }
          }
          
          availableSlots.sort();
          console.log("12. المواعيد المتاحة النهائية:", availableSlots);
          setSlots(availableSlots);

      } catch (error) {
          console.error("خطأ في تحميل المواعيد:", error);
          setSlots([]);
      } finally {
          setLoadingSlots(false);
      }
  };

  useEffect(() => {
    loadSlots(date);
  }, [date]);

  const book = async () => {
    setMsg(null);

    if (!selectedTime) {
        setMsg({ text: "⚠️ الرجاء اختيار وقت للحجز", type: "error" });
        return;
    }
    if (!patientName.trim()) {
        setMsg({ text: "⚠️ الرجاء إدخال الاسم", type: "error" });
        return;
    }
    if (!patientPhone.trim()) {
        setMsg({ text: "⚠️ الرجاء إدخال رقم الجوال", type: "error" });
        return;
    }

    setSaving(true);

    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `CL-${yy}${mm}${dd}-${random}`;

    try {
        // أولاً: تحقق إذا كان الموعد لا يزال متاحاً (تأكد إضافي)
        const { data: existingBooking } = await supabase
            .from("appointments")
            .select("*")
            .eq("appointment_date", date)
            .eq("appointment_time", selectedTime)
            .neq("status", "cancelled");

        if (existingBooking && existingBooking.length > 0) {
            setMsg({ 
                text: "❌ هذا الوقت تم حجزه للتو، الرجاء اختيار وقت آخر", 
                type: "error" 
            });
            // تحديث المواعيد فوراً
            await loadSlots(date);
            setSaving(false);
            return;
        }

        // ثانياً: إدخال الحجز
        const { error } = await supabase.from("appointments").insert({
            appointment_date: date,
            appointment_time: selectedTime,
            status: "confirmed",
            patient_name: patientName.trim(),
            patient_phone: patientPhone.trim(),
            booking_number: bookingNumber,
        });

        if (error) {
            if ((error as any).code === "23505") { // خطأ التكرار
                setMsg({ 
                    text: "❌ هذا الوقت تم حجزه للتو، الرجاء اختيار وقت آخر", 
                    type: "error" 
                });
            } else {
                setMsg({ text: `❌ تعذر الحجز: ${error.message}`, type: "error" });
            }
            return;
        }

        // ثالثاً: تحديث المواعيد فوراً بعد الحجز الناجح
        await loadSlots(date);

        // رابعاً: عرض رسالة النجاح
        const verifyLink = `${window.location.origin}/verify?code=${encodeURIComponent(bookingNumber)}`;
        
        const bookingInfo = {
            number: bookingNumber,
            date,
            time: selectedTime,
            name: patientName.trim(),
            phone: patientPhone.trim(),
            verifyLink
        };
        
        setBookingDetails(bookingInfo);
        setBookingComplete(true);
        
        const successMessage = 
            `✅ تم حجز الموعد بنجاح!\n\n` +
            `📋 رقم الحجز: ${bookingNumber}\n` +
            `📅 التاريخ: ${new Date(date).toLocaleDateString('ar-EG')}\n` +
            `⏰ الوقت: ${selectedTime}\n` +
            `👤 الاسم: ${patientName.trim()}\n` +
            `📞 الجوال: ${patientPhone.trim()}`;

        setMsg({ text: successMessage, type: "success" });

        // خامساً: تفريغ الحقول
        setPatientName("");
        setPatientPhone("");
        setSelectedTime("");
        
    } catch (e: any) {
        setMsg({ text: `❌ تعذر الحجز: ${e?.message ?? "خطأ غير معروف"}`, type: "error" });
    } finally {
        setSaving(false);
    }
  };

  const getDayName = (dateStr: string) => {
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dayIndex = new Date(dateStr).getDay();
    return days[dayIndex];
  };

  return (
    <div className="section-container" style={{ maxWidth: "900px" }}>
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem" }}>حجز موعد</h1>
        <div style={{ 
          width: "80px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "10px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ color: "var(--gray-600)", fontSize: "1.1rem" }}>
          احجبي موعدك بسهولة مع دكتورة سارة أحمد
        </p>
      </div>

      {/* بطاقة الطبيبة */}
      <div className="card" style={{ 
        marginBottom: "30px",
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        color: "white"
      }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem"
          }}>
            👩‍⚕️
          </div>
          <div>
            <h2 style={{ color: "white", marginBottom: "10px" }}>د. أسياء محمد ناجي</h2>
            <p style={{ color: "white", marginBottom: "5px" }}>استشارية نساء وتوليد</p>
            <p style={{ color: "white", fontSize: "0.9rem" }}>
              ⭐ خبرة 30+ سنة | 🏥 10000+ مريضة | 👶 5000+ ولادة
            </p>
          </div>
        </div>
      </div>

      {!bookingComplete ? (
        <>
          {/* اختيار التاريخ */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "var(--primary-dark)", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>📅</span> اختيار التاريخ
            </h3>
            <div>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem",
                  width: "100%",
                  maxWidth: "300px",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
              <p style={{ marginTop: "10px", color: "var(--gray-600)", fontSize: "0.9rem" }}>
                اليوم: {getDayName(date)}
              </p>
            </div>
          </div>

          {/* المواعيد المتاحة */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "var(--primary-dark)", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>⏰</span> المواعيد المتاحة
            </h3>

            {loadingSlots ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
                <p style={{ color: "var(--gray-600)" }}>جاري تحميل المواعيد...</p>
              </div>
            ) : slots.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px",
                background: "var(--gray-50)",
                borderRadius: "12px"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>😔</div>
                <p style={{ color: "var(--gray-600)" }}>لا توجد مواعيد متاحة لهذا اليوم</p>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-500)", marginTop: "10px" }}>
                  الرجاء اختيار يوم آخر
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "10px", 
                  marginBottom: "15px",
                  justifyContent: "center"
                }}>
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "50px",
                        border: selectedTime === t ? "none" : "2px solid var(--gray-200)",
                        background: selectedTime === t 
                          ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                          : "transparent",
                        color: selectedTime === t ? "white" : "var(--gray-700)",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: selectedTime === t ? "600" : "400",
                        transition: "all 0.3s ease",
                        boxShadow: selectedTime === t ? "var(--shadow-md)" : "none"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                {/* ملخص المواعيد حسب اليوم */}
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "var(--gray-50)",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  color: "var(--gray-600)"
                }}>
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
                    <span>🟢 {slots.length} موعد متاح</span>
                    <span>⏱️ مدة كل موعد: 15 دقيقة</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* معلومات الحجز */}
          {(selectedTime || patientName || patientPhone) && (
            <div className="card" style={{ marginBottom: "20px", border: "2px solid var(--primary-light)" }}>
              <h3 style={{ color: "var(--primary-dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📝</span> معلومات الحجز
              </h3>

              {selectedTime && (
                <div style={{
                  background: "var(--gray-50)",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "var(--gray-600)" }}>الموعد المختار:</span>
                  <span style={{ 
                    fontWeight: "bold", 
                    color: "var(--primary-dark)",
                    fontSize: "1.1rem"
                  }}>
                    {selectedTime}
                  </span>
                </div>
              )}

              <input
                placeholder="الاسم الكامل"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  marginBottom: "15px",
                  fontSize: "1rem",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />
              
              <input
                placeholder="رقم الجوال (05xxxxxxxx)"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "2px solid var(--gray-200)",
                  marginBottom: "20px",
                  fontSize: "1rem",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
              />

              <button
                onClick={book}
                disabled={saving || !selectedTime}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  background: !selectedTime 
                    ? "var(--gray-300)" 
                    : "linear-gradient(135deg, var(--secondary), var(--secondary-light))",
                  color: !selectedTime ? "var(--gray-600)" : "var(--gray-800)",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: !selectedTime ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {saving ? "⏳ جاري الحجز..." : "✅ تأكيد الحجز"}
              </button>
            </div>
          )}
        </>
      ) : (
        /* رسالة النجاح */
        <div className="card" style={{ 
          textAlign: "center",
          border: "3px solid #10b981"
        }}>
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🎉</div>
          <h2 style={{ color: "#065f46", marginBottom: "15px" }}>تم حجز الموعد بنجاح!</h2>
          
          {bookingDetails && (
            <div style={{
              background: "var(--gray-50)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "20px",
              textAlign: "right"
            }}>
              <p><strong>📋 رقم الحجز:</strong> {bookingDetails.number}</p>
              <p><strong>📅 التاريخ:</strong> {new Date(bookingDetails.date).toLocaleDateString('ar-EG')}</p>
              <p><strong>⏰ الوقت:</strong> {bookingDetails.time}</p>
              <p><strong>👤 الاسم:</strong> {bookingDetails.name}</p>
              <p><strong>📞 الجوال:</strong> {bookingDetails.phone}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(msg?.text || "")}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "50px",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              <span>📱</span> إرسال عبر واتساب
            </a>
            
            <button
              onClick={() => {
                setBookingComplete(false);
                setMsg(null);
              }}
              style={{
                padding: "12px 24px",
                borderRadius: "50px",
                background: "transparent",
                border: "2px solid var(--primary)",
                color: "var(--primary)"
              }}
            >
              حجز موعد آخر
            </button>
          </div>
        </div>
      )}

      {/* رسائل الخطأ/النجاح */}
      {msg && !bookingComplete && (
        <div className="card" style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: msg.type === "error" ? "#fee2e2" : 
                         msg.type === "success" ? "#d1fae5" : "#e2e3e5",
          border: "none"
        }}>
          <div style={{ whiteSpace: "pre-wrap", color: msg.type === "error" ? "#991b1b" : "#065f46" }}>
            {msg.text}
          </div>
          
          {msg.type === "success" && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(msg.text)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "15px",
                padding: "10px 20px",
                borderRadius: "50px",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              <span>📱</span> إرسال التفاصيل عبر واتساب
            </a>
          )}
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="card" style={{ marginTop: "20px", textAlign: "center" }}>
        <h4 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>📌 ملاحظات مهمة</h4>
        <p style={{ color: "var(--gray-600)", fontSize: "0.95rem" }}>
          • يرجى الحضور قبل الموعد بـ 10 دقائق<br />
          • في حالة التأخير أكثر من 15 دقيقة سيتم إلغاء الحجز<br />
          • يمكنك إلغاء الحجز قبل 24 ساعة على الأقل
        </p>
      </div>
    </div>
  );
}