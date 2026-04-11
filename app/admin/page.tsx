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
  status: "unread" | "read" | "replied";
  created_at: string;
};

type TabType = "appointments" | "blocked" | "messages";
type AppointmentFilterType = "today" | "tomorrow" | "all" | "customDate";

const PRIMARY = "#8B0000";
const SECONDARY = "#C04040";

function formatDateOnly(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function displayDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function getArabicDayName(dateStr: string) {
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return days[new Date(dateStr).getDay()];
}

function statusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "انتظار";
    case "confirmed":
      return "مؤكد";
    case "completed":
      return "مكتمل";
    case "cancelled":
    case "canceled":
      return "ملغي";
    default:
      return status;
  }
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "#16a34a";
    case "completed":
      return "#2563eb";
    case "cancelled":
    case "canceled":
      return "#dc2626";
    case "pending":
    default:
      return "#d97706";
  }
}

function messageStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "read":
      return "مقروءة";
    case "replied":
      return "تم الرد";
    case "unread":
    default:
      return "غير مقروءة";
  }
}

function messageStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "read":
      return "#2563eb";
    case "replied":
      return "#16a34a";
    case "unread":
    default:
      return "#d97706";
  }
}

function AdminLogin({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [msg, setMsg] = useState("");

  const adminPins = [
    process.env.NEXT_PUBLIC_ADMIN_PIN_1 ?? "",
    process.env.NEXT_PUBLIC_ADMIN_PIN_2 ?? "",
    process.env.NEXT_PUBLIC_ADMIN_PIN_3 ?? "",
  ].filter(Boolean);

  const login = () => {
    const value = pin.trim();

    if (!value) {
      setMsg("أدخل رمز الإدارة أولًا");
      return;
    }

    if (adminPins.includes(value)) {
      setMsg("");
      onSuccess();
      return;
    }

    setMsg("PIN غير صحيح");
  };

  return (
    <div
      className="section-container"
      style={{
        maxWidth: "520px",
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "130px",
            height: "130px",
            margin: "0 auto 26px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0.2))",
            boxShadow: "0 18px 34px rgba(139,0,0,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <img
            src="/logo.png"
            alt="شعار مركز آسيا الطبي"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%",
              background: "white",
            }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h1 style={{ marginBottom: "10px" }}>دخول الإدارة</h1>
          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(139,0,0,0.10)",
              color: "var(--text)",
              fontSize: "0.98rem",
            }}
          >
            أدخل رمز الإدارة للوصول إلى لوحة التحكم
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "28px",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", marginBottom: "18px" }}>
            <input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="أدخل PIN الإدارة"
              style={{
                textAlign: "center",
                fontSize: "1.25rem",
                letterSpacing: "6px",
                fontWeight: 800,
                paddingInline: "54px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
            />

            <button
              type="button"
              onClick={() => setShowPin((prev) => !prev)}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "transparent",
                color: PRIMARY,
                boxShadow: "none",
                padding: 0,
                border: "none",
              }}
            >
              {showPin ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="button"
            onClick={login}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "1.08rem",
              fontWeight: 800,
            }}
          >
            دخول
          </button>

          {msg && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: 700,
              }}
            >
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  const tabs = [
    { key: "appointments" as const, label: "الحجوزات", icon: "📅" },
    { key: "blocked" as const, label: "حجب الأوقات", icon: "🚫" },
    { key: "messages" as const, label: "الرسائل", icon: "💬" },
  ];

  return (
    <div
      style={{
        marginTop: "16px",
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: "999px",
        padding: "6px",
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: active ? "rgba(255,255,255,0.22)" : "transparent",
              color: "white",
              border: "none",
              boxShadow: "none",
              minWidth: "150px",
              padding: "12px 18px",
              fontWeight: 800,
            }}
          >
            <span style={{ marginLeft: "8px" }}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function AppointmentsTab() {
  const today = useMemo(() => formatDateOnly(new Date()), []);
  const [filterType, setFilterType] = useState<AppointmentFilterType>("today");
  const [selectedDate, setSelectedDate] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" | "" }>({
    text: "",
    type: "",
  });

  const effectiveDate = useMemo(() => {
    const now = new Date();

    if (filterType === "today") return formatDateOnly(now);

    if (filterType === "tomorrow") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return formatDateOnly(tomorrow);
    }

    if (filterType === "customDate") return selectedDate;

    return today;
  }, [filterType, selectedDate, today]);

  const loadAppointments = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      let query = supabase
        .from("appointments")
        .select("*");

      if (filterType !== "all") {
        query = query.eq("appointment_date", effectiveDate);
      }

      const { data, error } = await query
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: true });

      if (error) throw error;

      setAppointments((data ?? []) as Appointment[]);
    } catch (error: any) {
      setMsg({
        text: `تعذر تحميل الحجوزات: ${error.message}`,
        type: "error",
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filterType, effectiveDate]);

  const updateStatus = async (
    id: string,
    newStatus: string,
    appointmentDate: string,
    appointmentTime: string,
    currentStatus: string
  ) => {
    try {
      const current = currentStatus.toLowerCase();
      const next = newStatus.toLowerCase();
      const isCurrentCancelled = current === "cancelled" || current === "canceled";
      const isNextActive = next !== "cancelled" && next !== "canceled";

      if (isCurrentCancelled && isNextActive) {
        const { data: conflicting, error: conflictError } = await supabase
          .from("appointments")
          .select("id,status")
          .eq("appointment_date", appointmentDate)
          .eq("appointment_time", appointmentTime)
          .neq("id", id)
          .not("status", "in", "(cancelled,canceled)")
          .maybeSingle();

        if (conflictError) throw conflictError;

        if (conflicting) {
          setMsg({
            text: "لا يمكن تفعيل هذا الحجز لأن الوقت محجوز بحجز آخر بالفعل",
            type: "error",
          });
          return;
        }
      }

      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setMsg({ text: "تم تحديث الحالة", type: "success" });
      await loadAppointments();
    } catch (error: any) {
      setMsg({
        text: `فشل تحديث الحالة: ${error.message}`,
        type: "error",
      });
    }
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter(
      (a) => a.status === "cancelled" || a.status === "canceled"
    ).length,
  };

  const filterChip = (
    key: AppointmentFilterType,
    label: string,
    icon: string
  ) => {
    const active = filterType === key;

    return (
      <button
        type="button"
        onClick={() => setFilterType(key)}
        style={{
          background: active ? PRIMARY : "rgba(139,0,0,0.06)",
          color: active ? "white" : PRIMARY,
          boxShadow: "none",
          border: active ? "none" : "1px solid rgba(139,0,0,0.12)",
          padding: "10px 16px",
        }}
      >
        <span style={{ marginLeft: "6px" }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div style={{ padding: "18px 0 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        {[
          { label: "إجمالي", value: stats.total, color: PRIMARY },
          { label: "مؤكد", value: stats.confirmed, color: "#16a34a" },
          { label: "مكتمل", value: stats.completed, color: "#2563eb" },
          { label: "ملغي", value: stats.cancelled, color: "#dc2626" },
        ].map((item, index) => (
          <div key={index} className="card" style={{ padding: "18px", textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: item.color,
                marginBottom: "6px",
              }}
            >
              {item.value}
            </div>
            <div style={{ color: "var(--text-soft)", fontWeight: 700 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "20px", textAlign: "right" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {filterChip("today", "اليوم", "📅")}
          {filterChip("tomorrow", "غدًا", "🗓️")}
          {filterChip("all", "كل الأيام", "📋")}
          {filterChip("customDate", "اختيار تاريخ", "🧭")}

          {filterType === "customDate" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ maxWidth: "220px" }}
            />
          )}
        </div>
      </div>

      {msg.text && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            background: msg.type === "error" ? "#fee2e2" : "#dcfce7",
            color: msg.type === "error" ? "#991b1b" : "#166534",
            fontWeight: 700,
          }}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "42px" }}>
          ⏳ جاري التحميل...
        </div>
      ) : appointments.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "50px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📭</div>
          <div style={{ color: "var(--text-soft)", fontWeight: 700 }}>
            لا توجد حجوزات في هذا القسم
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {appointments.map((item) => {
            const color = statusColor(item.status);

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  textAlign: "right",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "46px",
                      borderRadius: "999px",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: PRIMARY,
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        marginBottom: "4px",
                      }}
                    >
                      {item.patient_name || "-"}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        background: `${color}20`,
                        color,
                        fontWeight: 800,
                        fontSize: "0.88rem",
                      }}
                    >
                      {statusLabel(item.status)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
                  <div>📱 الجوال: {item.patient_phone || "-"}</div>
                  <div>📅 التاريخ: {item.appointment_date || "-"}</div>
                  <div>⏰ الوقت: {item.appointment_time || "-"}</div>
                  <div>🔢 رقم الحجز: {item.booking_number || "-"}</div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      fontWeight: 800,
                      color: PRIMARY,
                      marginBottom: "10px",
                    }}
                  >
                    تحديث الحالة
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {[
                      { label: "انتظار", value: "pending", color: "#d97706" },
                      { label: "مؤكد", value: "confirmed", color: "#16a34a" },
                      { label: "مكتمل", value: "completed", color: "#2563eb" },
                      { label: "ملغي", value: "cancelled", color: "#dc2626" },
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            btn.value,
                            item.appointment_date,
                            item.appointment_time,
                            item.status
                          )
                        }
                        style={{
                          background: `${btn.color}18`,
                          color: btn.color,
                          boxShadow: "none",
                          border: "none",
                          padding: "10px 14px",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlockedTimesTab() {
  const today = useMemo(() => formatDateOnly(new Date()), []);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" | "" }>({
    text: "",
    type: "",
  });

  const loadBlockedTimes = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("blocked_times")
        .select("*")
        .order("date", { ascending: false })
        .order("start_time", { ascending: true });

      if (error) throw error;

      setBlockedTimes((data ?? []) as BlockedTime[]);
    } catch (error: any) {
      setMsg({
        text: `تعذر تحميل الأوقات المحجوبة: ${error.message}`,
        type: "error",
      });
      setBlockedTimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockedTimes();
  }, []);

  const addBlockedTime = async () => {
    if (!date || !startTime || !endTime) {
      setMsg({
        text: "اختر التاريخ ووقت البداية ووقت النهاية",
        type: "error",
      });
      return;
    }

    if (startTime >= endTime) {
      setMsg({
        text: "وقت النهاية يجب أن يكون بعد وقت البداية",
        type: "error",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("blocked_times").insert({
        date,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        reason: reason.trim() ? reason.trim() : null,
      });

      if (error) throw error;

      setMsg({ text: "تمت إضافة وقت محجوب", type: "success" });
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
      await loadBlockedTimes();
    } catch (error: any) {
      setMsg({
        text: `فشل إضافة الوقت المحجوب: ${error.message}`,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteBlockedTime = async (id: string) => {
    const ok = confirm("هل أنت متأكد من حذف هذا الوقت المحجوب؟");
    if (!ok) return;

    try {
      const { error } = await supabase.from("blocked_times").delete().eq("id", id);

      if (error) throw error;

      setMsg({ text: "تم حذف الوقت المحجوب", type: "success" });
      await loadBlockedTimes();
    } catch (error: any) {
      setMsg({
        text: `فشل الحذف: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div style={{ paddingTop: "18px" }}>
      <div className="card" style={{ marginBottom: "20px", textAlign: "right" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "28px",
              borderRadius: "999px",
              background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})`,
            }}
          />
          <h3 style={{ margin: 0 }}>إضافة وقت محجوب</h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="السبب (اختياري)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={addBlockedTime}
          disabled={saving}
          style={{
            width: "100%",
            padding: "15px",
            fontWeight: 800,
          }}
        >
          {saving ? "⏳ جاري الإضافة..." : "إضافة"}
        </button>
      </div>

      {msg.text && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            background: msg.type === "error" ? "#fee2e2" : "#dcfce7",
            color: msg.type === "error" ? "#991b1b" : "#166534",
            fontWeight: 700,
          }}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          ⏳ جاري التحميل...
        </div>
      ) : blockedTimes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "14px" }}>🚫</div>
          <div style={{ color: "var(--text-soft)", fontWeight: 700 }}>
            لا توجد أوقات محجوبة
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {blockedTimes.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                textAlign: "right",
                padding: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "16px",
                    background: "rgba(220,38,38,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                  }}
                >
                  🚫
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: PRIMARY,
                      fontWeight: 800,
                      fontSize: "1.08rem",
                      marginBottom: "4px",
                    }}
                  >
                    {item.date}
                  </div>
                  <div style={{ color: "var(--text-soft)" }}>
                    {item.start_time?.substring(0, 5)} - {item.end_time?.substring(0, 5)}
                  </div>
                  {item.reason && (
                    <div style={{ color: "var(--text-soft)", marginTop: "4px" }}>
                      السبب: {item.reason}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteBlockedTime(item.id)}
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    boxShadow: "none",
                    padding: "10px 14px",
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" | "" }>({
    text: "",
    type: "",
  });

  const loadMessages = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMessages((data ?? []) as Message[]);
    } catch (error: any) {
      setMsg({
        text: `تعذر تحميل الرسائل: ${error.message}`,
        type: "error",
      });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const updateMessageStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setMsg({ text: "تم تحديث حالة الرسالة", type: "success" });
      await loadMessages();
    } catch (error: any) {
      setMsg({
        text: `فشل تحديث الحالة: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div style={{ paddingTop: "18px" }}>
      {msg.text && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            background: msg.type === "error" ? "#fee2e2" : "#dcfce7",
            color: msg.type === "error" ? "#991b1b" : "#166534",
            fontWeight: 700,
          }}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          ⏳ جاري التحميل...
        </div>
      ) : messages.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "14px" }}>📭</div>
          <div style={{ color: "var(--text-soft)", fontWeight: 700 }}>
            لا توجد رسائل
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {messages.map((item) => {
            const color = messageStatusColor(item.status);

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  textAlign: "right",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "42px",
                      borderRadius: "999px",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: PRIMARY,
                        fontSize: "1.18rem",
                        fontWeight: 800,
                        marginBottom: "4px",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        background: `${color}20`,
                        color,
                        fontWeight: 800,
                        fontSize: "0.88rem",
                      }}
                    >
                      {messageStatusLabel(item.status)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
                  <div>📱 الجوال: {item.phone}</div>
                  {item.email && <div>✉️ البريد: {item.email}</div>}
                  <div>📌 العنوان: {item.subject}</div>
                </div>

                <div
                  style={{
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: PRIMARY,
                      fontWeight: 800,
                      marginBottom: "8px",
                    }}
                  >
                    نص الرسالة
                  </div>
                  <div style={{ lineHeight: 1.9, color: "var(--text)" }}>{item.message}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateMessageStatus(item.id, "unread")}
                    style={{
                      background: "#fef3c7",
                      color: "#d97706",
                      boxShadow: "none",
                    }}
                  >
                    غير مقروءة
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMessageStatus(item.id, "read")}
                    style={{
                      background: "#dbeafe",
                      color: "#2563eb",
                      boxShadow: "none",
                    }}
                  >
                    مقروءة
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMessageStatus(item.id, "replied")}
                    style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      boxShadow: "none",
                    }}
                  >
                    تم الرد
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("appointments");

  return (
    <div className="section-container" style={{ paddingTop: "10px" }}>
      <div
        style={{
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          marginBottom: "22px",
          background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})`,
          color: "white",
        }}
      >
        <div
          style={{
            padding: "28px 22px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            لوحة الإدارة
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.8,
              maxWidth: "760px",
              margin: "0 auto 16px",
            }}
          >
            تابع الحجوزات، الرسائل، وحجب الأوقات بسهولة بنفس فكرة لوحة التحكم داخل التطبيق.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <button
              type="button"
              onClick={onLogout}
              style={{
                background: "rgba(255,255,255,0.14)",
                color: "white",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              🚪 خروج
            </button>
          </div>

          <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {activeTab === "appointments" && <AppointmentsTab />}
      {activeTab === "blocked" && <BlockedTimesTab />}
      {activeTab === "messages" && <MessagesTab />}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  return authed ? (
    <AdminDashboard onLogout={() => setAuthed(false)} />
  ) : (
    <AdminLogin onSuccess={() => setAuthed(true)} />
  );
}