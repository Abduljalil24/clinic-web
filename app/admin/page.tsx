"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Appointment = {
  id: string;
  booking_number: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  patient_name: string | null;
  patient_phone: string | null;
  created_at: string;
};

type BlockedTime = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  created_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
};

export default function AdminPage() {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // قائمة الأكواد السرية المسموح بها
  const ADMIN_PINS = [
    process.env.NEXT_PUBLIC_ADMIN_PIN_1 ?? "",
    process.env.NEXT_PUBLIC_ADMIN_PIN_2 ?? "",
    process.env.NEXT_PUBLIC_ADMIN_PIN_3 ?? "",
  ].filter(pin => pin !== ""); // نحذف أي قيم فارغة

  // حالات تسجيل الدخول
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
  // حالات التبويبات
  const [activeTab, setActiveTab] = useState<"appointments" | "blocked" | "messages">("appointments");

  // حالات الحجوزات
  const [date, setDate] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [stats, setStats] = useState({ 
    total: 0, 
    confirmed: 0, 
    cancelled: 0, 
    completed: 0,
    pending: 0 
  });

  // حالات الأوقات المحجوزة
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [showAddBlockForm, setShowAddBlockForm] = useState(false);
  const [newBlockedTime, setNewBlockedTime] = useState({
    date: today,
    start_time: "09:00",
    end_time: "17:00",
    reason: ""
  });

  // حالات الرسائل
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  // ============= دوال الحجوزات =============
  const loadAppointments = async () => {
    setMsg({ text: "", type: "" });
    setLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", date)
      .order("appointment_time", { ascending: true });

    setLoading(false);

    if (error) {
      setMsg({ text: `❌ تعذر جلب الحجوزات: ${error.message}`, type: "error" });
      setAppointments([]);
      return;
    }

    const appointmentsData = (data ?? []) as Appointment[];
    setAppointments(appointmentsData);
    
    setStats({
      total: appointmentsData.length,
      confirmed: appointmentsData.filter(r => r.status === "confirmed").length,
      cancelled: appointmentsData.filter(r => r.status === "cancelled").length,
      completed: appointmentsData.filter(r => r.status === "completed").length,
      pending: appointmentsData.filter(r => r.status === "pending").length,
    });
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    console.log("1. بدأ التحديث", { id, newStatus });
    
    setMsg({ text: "", type: "" });
    
    // ✅ بدون .select() 
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    console.log("2. نتيجة التحديث:", { error });

    if (error) {
      console.error("❌ الخطأ بالتفصيل:", error);
      setMsg({ text: `❌ فشل التحديث: ${error.message}`, type: "error" });
    } else {
      console.log("✅ تم التحديث بنجاح");
      setMsg({ text: `✅ تم التحديث بنجاح`, type: "success" });
      
      // انتظري شوية وبعدين حملي البيانات الجديدة
      setTimeout(() => {
        loadAppointments();
      }, 500);
    }
  };

  const cancelAppointment = async (id: string) => {
    console.log("1. بدأ الإلغاء", { id });
    
    const ok = confirm("هل أنت متأكد من إلغاء هذا الحجز؟");
    if (!ok) return;

    setMsg({ text: "", type: "" });

    // ✅ بدون .select()
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);

    console.log("2. نتيجة الإلغاء:", { error });

    if (error) {
      console.error("❌ الخطأ بالتفصيل:", error);
      setMsg({ text: `❌ فشل الإلغاء: ${error.message}`, type: "error" });
    } else {
      console.log("✅ تم الإلغاء بنجاح");
      setMsg({ text: "✅ تم إلغاء الحجز بنجاح", type: "success" });
      
      // انتظري شوية وبعدين حملي البيانات الجديدة
      setTimeout(() => {
        loadAppointments();
      }, 500);
    }
  };

  // ============= دوال الأوقات المحجوزة =============
  const loadBlockedTimes = async () => {
    setLoadingBlocked(true);
    const { data, error } = await supabase
      .from("blocked_times")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("خطأ في جلب الأوقات المحجوزة:", error);
    } else {
      setBlockedTimes(data || []);
    }
    setLoadingBlocked(false);
  };

  const addBlockedTime = async () => {
    // التحقق من المدخلات
    if (!newBlockedTime.date || !newBlockedTime.start_time || !newBlockedTime.end_time) {
      setMsg({ text: "❌ الرجاء إدخال جميع الحقول", type: "error" });
      return;
    }

    if (newBlockedTime.start_time >= newBlockedTime.end_time) {
      setMsg({ text: "❌ وقت النهاية يجب أن يكون بعد وقت البداية", type: "error" });
      return;
    }

    setLoadingBlocked(true);

    const { error } = await supabase
      .from("blocked_times")
      .insert([{
        date: newBlockedTime.date,
        start_time: newBlockedTime.start_time,
        end_time: newBlockedTime.end_time,
        reason: newBlockedTime.reason || null
      }]);

    setLoadingBlocked(false);

    if (error) {
      setMsg({ text: `❌ خطأ في الإضافة: ${error.message}`, type: "error" });
    } else {
      setMsg({ text: "✅ تمت إضافة الوقت المحجوز بنجاح", type: "success" });
      setShowAddBlockForm(false);
      setNewBlockedTime({
        date: today,
        start_time: "09:00",
        end_time: "17:00",
        reason: ""
      });
      await loadBlockedTimes();
    }
  };

  const deleteBlockedTime = async (id: string) => {
    const ok = confirm("هل أنت متأكد من حذف هذا الوقت المحجوز؟");
    if (!ok) return;

    const { error } = await supabase
      .from("blocked_times")
      .delete()
      .eq("id", id);

    if (error) {
      setMsg({ text: `❌ خطأ في الحذف: ${error.message}`, type: "error" });
    } else {
      setMsg({ text: "✅ تم حذف الوقت المحجوز", type: "success" });
      await loadBlockedTimes();
    }
  };

  // ============= دوال الرسائل =============
  const loadMessages = async () => {
    setLoadingMessages(true);
    
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (messageFilter !== 'all') {
      query = query.eq('status', messageFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("خطأ في جلب الرسائل:", error);
    } else {
      setMessages(data || []);
    }
    setLoadingMessages(false);
  };

  const updateMessageStatus = async (id: string, newStatus: 'read' | 'replied') => {
    const { error } = await supabase
      .from('messages')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error("خطأ في التحديث:", error);
    } else {
      loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("خطأ في الحذف:", error);
    } else {
      loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  // تحميل البيانات عند تسجيل الدخول
  useEffect(() => {
    if (authed) {
      loadAppointments();
      loadBlockedTimes();
      loadMessages();
    }
  }, [authed, date]);

  useEffect(() => {
    if (authed) {
      loadMessages();
    }
  }, [authed, messageFilter]);

  // ============= دوال مساعدة =============
  const getStatusBadge = (status: string) => {
    const config = {
      confirmed: { color: "#065f46", bg: "#d1fae5", text: "مؤكد" },
      pending: { color: "#92400e", bg: "#fef3c7", text: "قيد الانتظار" },
      cancelled: { color: "#991b1b", bg: "#fee2e2", text: "ملغي" },
      completed: { color: "#1e40af", bg: "#dbeafe", text: "مكتمل" }
    };
    const current = config[status as keyof typeof config] || config.pending;
    
    return (
      <span style={{
        backgroundColor: current.bg,
        color: current.color,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "inline-block"
      }}>
        {current.text}
      </span>
    );
  };

  const getDayNameArabic = (dateStr: string) => {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    return days[new Date(dateStr).getDay()];
  };

  // ============= واجهة تسجيل الدخول =============
  if (!authed) {
    return (
      <div className="section-container" style={{ maxWidth: "450px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          borderRadius: "30px",
          padding: "40px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "white",
            fontSize: "2.5rem"
          }}>
            🔒
          </div>
          
          <h1 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>لوحة الإدارة</h1>
          <p style={{ color: "var(--gray-600)", marginBottom: "30px" }}>الرجاء إدخال رمز الدخول</p>

          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="رمز الإدارة"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "2px solid var(--gray-200)",
                fontSize: "1.1rem",
                textAlign: "center",
                letterSpacing: "4px",
                outline: "none"
              }}
            />
            <button
              onClick={() => setShowPin(!showPin)}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem"
              }}
            >
              {showPin ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button
            onClick={() => {
              if (ADMIN_PINS.includes(pin)) {
                setAuthed(true);
              } else {
                setMsg({ text: "❌ رمز غير صحيح", type: "error" });
                setTimeout(() => setMsg({ text: "", type: "" }), 3000);
              }
            }}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            دخول
          </button>

          {msg.text && (
            <div style={{
              marginTop: "20px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: msg.type === "error" ? "#fee2e2" : "#d1fae5",
              color: msg.type === "error" ? "#991b1b" : "#065f46"
            }}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============= الواجهة الرئيسية =============
  return (
    <div className="section-container">
      {/* رأس الصفحة */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <div>
          <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem", margin: 0 }}>لوحة الإدارة</h1>
          <div style={{ 
            width: "80px", 
            height: "4px", 
            background: "linear-gradient(90deg, var(--primary), var(--secondary))",
            marginTop: "10px",
            borderRadius: "2px"
          }}></div>
        </div>
        
        <button 
          onClick={() => setAuthed(false)}
          style={{ 
            background: "transparent", 
            border: "2px solid var(--gray-200)",
            color: "var(--gray-600)",
            padding: "10px 25px",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }}
        >
          🚪 خروج
        </button>
      </div>

      {/* تبويبات التنقل */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        borderBottom: "2px solid var(--gray-200)",
        paddingBottom: "10px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setActiveTab("appointments")}
          style={{
            padding: "10px 25px",
            borderRadius: "30px",
            border: "none",
            background: activeTab === "appointments" 
              ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
              : "transparent",
            color: activeTab === "appointments" ? "white" : "var(--gray-600)",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }}
        >
          📋 الحجوزات ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab("blocked")}
          style={{
            padding: "10px 25px",
            borderRadius: "30px",
            border: "none",
            background: activeTab === "blocked" 
              ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
              : "transparent",
            color: activeTab === "blocked" ? "white" : "var(--gray-600)",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }}
        >
          🚫 الأوقات المحجوزة ({blockedTimes.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          style={{
            padding: "10px 25px",
            borderRadius: "30px",
            border: "none",
            background: activeTab === "messages" 
              ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
              : "transparent",
            color: activeTab === "messages" ? "white" : "var(--gray-600)",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }}
        >
          📨 الرسائل ({messages.filter(m => m.status === 'unread').length})
          {messages.filter(m => m.status === 'unread').length > 0 && (
            <span style={{
              background: "#ef4444",
              color: "white",
              padding: "2px 8px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              marginLeft: "8px"
            }}>
              {messages.filter(m => m.status === 'unread').length} جديد
            </span>
          )}
        </button>
      </div>

      {/* رسائل الحالة */}
      {msg.text && (
        <div style={{ 
          marginBottom: "20px",
          padding: "15px",
          borderRadius: "12px",
          backgroundColor: msg.type === "error" ? "#fee2e2" : "#d1fae5",
          color: msg.type === "error" ? "#991b1b" : "#065f46"
        }}>
          {msg.text}
        </div>
      )}

      {/* ============= قسم الحجوزات ============= */}
      {activeTab === "appointments" && (
        <>
          {/* إحصائيات سريعة */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "25px"
          }}>
            {[
              { label: "إجمالي", value: stats.total, color: "var(--primary)" },
              { label: "مؤكد", value: stats.confirmed, color: "#059669" },
              { label: "مكتمل", value: stats.completed, color: "#2563eb" },
              { label: "ملغي", value: stats.cancelled, color: "#dc2626" }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: "15px" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                <div style={{ color: "var(--gray-600)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* شريط التحكم */}
          <div className="card" style={{ marginBottom: "25px", padding: "20px" }}>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600" }}>📅 التاريخ:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "2px solid var(--gray-200)",
                    fontSize: "1rem"
                  }}
                />
              </div>
              <button onClick={loadAppointments} style={{ padding: "8px 20px" }}>
                🔄 تحديث
              </button>
              <span style={{ color: "var(--gray-600)" }}>{getDayNameArabic(date)}</span>
            </div>
          </div>

          {/* جدول الحجوزات */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>⏳ جاري التحميل...</div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--gray-500)" }}>
                📭 لا توجد حجوزات في هذا التاريخ
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white" }}>
                      <th style={{ padding: "12px", textAlign: "right" }}>الوقت</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>الحالة</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>المريض</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>الجوال</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>رقم الحجز</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app, index) => (
                      <tr key={app.id} style={{
                        borderBottom: "1px solid var(--gray-200)",
                        backgroundColor: index % 2 === 0 ? "white" : "var(--gray-50)"
                      }}>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "var(--gray-100)", padding: "4px 10px", borderRadius: "20px" }}>
                            ⏰ {app.appointment_time}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>{getStatusBadge(app.status)}</td>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{app.patient_name || "—"}</td>
                        <td style={{ padding: "12px" }}>{app.patient_phone || "—"}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ fontFamily: "monospace", background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px" }}>
                            #{app.booking_number || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {app.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(app.id, "completed")}
                                style={{ marginLeft: "8px", padding: "4px 12px", background: "#dbeafe", color: "#1e40af", border: "none", borderRadius: "4px", cursor: "pointer" }}
                              >
                                ✓ إكمال
                              </button>
                              <button
                                onClick={() => cancelAppointment(app.id)}
                                style={{ padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", cursor: "pointer" }}
                              >
                                ✕ إلغاء
                              </button>
                            </>
                          )}
                          {app.status === "pending" && (
                            <button
                              onClick={() => updateAppointmentStatus(app.id, "confirmed")}
                              style={{ padding: "4px 12px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            >
                              ✓ تأكيد
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ============= قسم الأوقات المحجوزة ============= */}
      {activeTab === "blocked" && (
        <>
          {/* زر إضافة وقت محجوز */}
          <button
            onClick={() => setShowAddBlockForm(!showAddBlockForm)}
            style={{
              marginBottom: "20px",
              padding: "12px 25px",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {showAddBlockForm ? "✕ إلغاء" : "➕ إضافة وقت محجوز"}
          </button>

          {/* نموذج إضافة وقت محجوز */}
          {showAddBlockForm && (
            <div className="card" style={{ marginBottom: "25px", padding: "20px" }}>
              <h3 style={{ color: "var(--primary-dark)", marginBottom: "20px" }}>إضافة وقت محجوز</h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>التاريخ</label>
                  <input
                    type="date"
                    min={today}
                    value={newBlockedTime.date}
                    onChange={(e) => setNewBlockedTime({...newBlockedTime, date: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid var(--gray-200)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>من الساعة</label>
                  <input
                    type="time"
                    value={newBlockedTime.start_time}
                    onChange={(e) => setNewBlockedTime({...newBlockedTime, start_time: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid var(--gray-200)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>إلى الساعة</label>
                  <input
                    type="time"
                    value={newBlockedTime.end_time}
                    onChange={(e) => setNewBlockedTime({...newBlockedTime, end_time: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid var(--gray-200)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>السبب (اختياري)</label>
                  <input
                    type="text"
                    value={newBlockedTime.reason}
                    onChange={(e) => setNewBlockedTime({...newBlockedTime, reason: e.target.value})}
                    placeholder="مثال: إجازة أسبوعية"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid var(--gray-200)"
                    }}
                  />
                </div>
              </div>

              <button
                onClick={addBlockedTime}
                disabled={loadingBlocked}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loadingBlocked ? "not-allowed" : "pointer",
                  opacity: loadingBlocked ? 0.7 : 1
                }}
              >
                {loadingBlocked ? "⏳ جاري الإضافة..." : "✅ حفظ"}
              </button>
            </div>
          )}

          {/* قائمة الأوقات المحجوزة */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              padding: "15px 20px",
              borderBottom: "2px solid var(--gray-200)",
              background: "var(--gray-50)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>
                🚫 الأوقات المحجوزة
              </h3>
              <span style={{
                background: "var(--primary)",
                color: "white",
                padding: "4px 15px",
                borderRadius: "30px",
                fontSize: "0.9rem"
              }}>
                {blockedTimes.length}
              </span>
            </div>

            {loadingBlocked ? (
              <div style={{ textAlign: "center", padding: "40px" }}>⏳ جاري التحميل...</div>
            ) : blockedTimes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--gray-500)" }}>
                📭 لا توجد أوقات محجوزة
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white" }}>
                      <th style={{ padding: "12px", textAlign: "right" }}>التاريخ</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>اليوم</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>من</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>إلى</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>السبب</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedTimes.map((bt, index) => (
                      <tr key={bt.id} style={{
                        borderBottom: "1px solid var(--gray-200)",
                        backgroundColor: index % 2 === 0 ? "white" : "var(--gray-50)"
                      }}>
                        <td style={{ padding: "12px" }}>{bt.date}</td>
                        <td style={{ padding: "12px", color: "var(--gray-600)" }}>{getDayNameArabic(bt.date)}</td>
                        <td style={{ padding: "12px" }}>{bt.start_time}</td>
                        <td style={{ padding: "12px" }}>{bt.end_time}</td>
                        <td style={{ padding: "12px" }}>{bt.reason || "—"}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            onClick={() => deleteBlockedTime(bt.id)}
                            style={{
                              padding: "6px 15px",
                              borderRadius: "6px",
                              border: "none",
                              background: "#fee2e2",
                              color: "#dc2626",
                              cursor: "pointer",
                              fontSize: "0.9rem"
                            }}
                          >
                            ✕ حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ============= قسم الرسائل ============= */}
      {activeTab === "messages" && (
        <>
          {/* إحصائيات الرسائل */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "25px"
          }}>
            <div className="card" style={{ textAlign: "center", padding: "15px", background: "var(--primary)" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>{messages.length}</div>
              <div style={{ color: "white" }}>إجمالي الرسائل</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: "15px", background: "#ef4444" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                {messages.filter(m => m.status === 'unread').length}
              </div>
              <div style={{ color: "white" }}>غير مقروءة</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: "15px", background: "#3b82f6" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                {messages.filter(m => m.status === 'read').length}
              </div>
              <div style={{ color: "white" }}>مقروءة</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: "15px", background: "#10b981" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                {messages.filter(m => m.status === 'replied').length}
              </div>
              <div style={{ color: "white" }}>تم الرد</div>
            </div>
          </div>

          {/* فلتر الرسائل */}
          <div className="card" style={{ marginBottom: "25px", padding: "20px" }}>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ fontWeight: "600" }}>🔍 تصفية حسب:</label>
              <select
                value={messageFilter}
                onChange={(e) => setMessageFilter(e.target.value as any)}
                style={{
                  padding: "8px 15px",
                  borderRadius: "8px",
                  border: "2px solid var(--gray-200)",
                  fontSize: "1rem"
                }}
              >
                <option value="all">كل الرسائل</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
                <option value="replied">تم الرد</option>
              </select>
              <button onClick={loadMessages} style={{ padding: "8px 20px" }}>
                🔄 تحديث
              </button>
            </div>
          </div>

          {/* قائمة الرسائل */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* الجانب الأيسر: قائمة الرسائل */}
            <div className="card" style={{ padding: 0, overflow: "hidden", height: "600px", overflowY: "auto" }}>
              {loadingMessages ? (
                <div style={{ textAlign: "center", padding: "40px" }}>⏳ جاري التحميل...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--gray-500)" }}>
                  📭 لا توجد رسائل
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid var(--gray-200)",
                      cursor: "pointer",
                      backgroundColor: selectedMessage?.id === msg.id ? "var(--gray-100)" : "white",
                      borderRight: msg.status === 'unread' ? "5px solid #ef4444" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>{msg.name}</span>
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        background: msg.status === 'unread' ? "#fee2e2" : 
                                  msg.status === 'read' ? "#dbeafe" : "#d1fae5",
                        color: msg.status === 'unread' ? "#dc2626" : 
                              msg.status === 'read' ? "#1e40af" : "#065f46"
                      }}>
                        {msg.status === 'unread' ? 'جديد' : msg.status === 'read' ? 'مقروء' : 'تم الرد'}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-600)", marginBottom: "5px" }}>
                      <span>📱 {msg.phone}</span>
                      {msg.email && <span> | ✉️ {msg.email}</span>}
                    </div>
                    <div style={{ fontWeight: "600", marginBottom: "5px" }}>📌 {msg.subject}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-700)" }}>
                      {msg.message.substring(0, 100)}...
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "8px" }}>
                      {new Date(msg.created_at).toLocaleString('ar-EG')}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* الجانب الأيمن: عرض تفاصيل الرسالة */}
            <div className="card" style={{ padding: "25px", minHeight: "600px" }}>
              {selectedMessage ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ color: "var(--primary-dark)", margin: 0 }}>تفاصيل الرسالة</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {selectedMessage.status !== 'read' && (
                        <button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                          style={{ padding: "5px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        >
                          ✓ تحديد كمقروء
                        </button>
                      )}
                      {selectedMessage.status !== 'replied' && (
                        <button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                          style={{ padding: "5px 12px", background: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        >
                          ↩️ تم الرد
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        style={{ padding: "5px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                      >
                        ✕ حذف
                      </button>
                    </div>
                  </div>

                  <div style={{ background: "var(--gray-50)", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "600", color: "var(--gray-600)", fontSize: "0.9rem", marginBottom: "5px" }}>الاسم</div>
                      <div style={{ fontSize: "1.1rem" }}>{selectedMessage.name}</div>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "600", color: "var(--gray-600)", fontSize: "0.9rem", marginBottom: "5px" }}>رقم الجوال</div>
                      <a href={`tel:${selectedMessage.phone}`} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "1.1rem" }}>
                        {selectedMessage.phone}
                      </a>
                    </div>

                    {selectedMessage.email && (
                      <div style={{ marginBottom: "15px" }}>
                        <div style={{ fontWeight: "600", color: "var(--gray-600)", fontSize: "0.9rem", marginBottom: "5px" }}>البريد الإلكتروني</div>
                        <a href={`mailto:${selectedMessage.email}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                          {selectedMessage.email}
                        </a>
                      </div>
                    )}

                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "600", color: "var(--gray-600)", fontSize: "0.9rem", marginBottom: "5px" }}>الموضوع</div>
                      <div style={{ background: "white", padding: "10px", borderRadius: "5px", fontWeight: "600" }}>
                        {selectedMessage.subject}
                      </div>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "600", color: "var(--gray-600)", fontSize: "0.9rem", marginBottom: "5px" }}>الرسالة</div>
                      <div style={{ background: "white", padding: "15px", borderRadius: "5px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div style={{ marginTop: "20px", padding: "15px", background: "#fef3c7", borderRadius: "8px" }}>
                      <div style={{ fontWeight: "600", marginBottom: "10px" }}>📱 تواصل سريع مع المريض:</div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          style={{ padding: "8px 15px", background: "var(--primary)", color: "white", borderRadius: "5px", textDecoration: "none" }}
                        >
                          📞 اتصال
                        </a>
                        <a
                          href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: "8px 15px", background: "#25D366", color: "white", borderRadius: "5px", textDecoration: "none" }}
                        >
                          📱 واتساب
                        </a>
                        {selectedMessage.email && (
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            style={{ padding: "8px 15px", background: "#ea4335", color: "white", borderRadius: "5px", textDecoration: "none" }}
                          >
                            ✉️ بريد
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--gray-500)" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📨</div>
                  <p>اختر رسالة من القائمة لعرض التفاصيل</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}