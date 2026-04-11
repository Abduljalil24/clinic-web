"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const PRIMARY = "#8B0000";
const SECONDARY = "#C04040";

type ServiceRow = {
  id: string;
  name?: string | null;
  created_at?: string | null;
};

type BookingResult = {
  booking_number: string | null;
  appointment_date: string;
};

type MessageType = "success" | "error" | "info";

export default function BookPage() {
  const today = useMemo(() => {
    const now = new Date();
    return formatDate(now);
  }, []);

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  const [msg, setMsg] = useState<{ text: string; type: MessageType } | null>(
    null
  );

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes();
    } else {
      setAvailableTimes([]);
      setSelectedTime("");
    }
  }, [selectedDate]);

  async function loadServices() {
    setIsLoadingServices(true);

    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setServices((data ?? []) as ServiceRow[]);
    } catch (error: any) {
      showMessage(`تعذر تحميل الخدمات: ${error.message}`, "error");
    } finally {
      setIsLoadingServices(false);
    }
  }

  function serviceLabel(row: ServiceRow) {
    return (row.name ?? "خدمة").toString();
  }

  async function loadAvailableTimes() {
    if (!selectedDate) return;

    setIsLoadingTimes(true);
    setAvailableTimes([]);
    setSelectedTime("");

    try {
      const selectedDateObj = new Date(selectedDate);

      const { data: workingHoursRes, error: workingHoursError } = await supabase
        .from("working_hours")
        .select("*");

      if (workingHoursError) throw workingHoursError;

      const { data: breaksRes, error: breaksError } = await supabase
        .from("breaks")
        .select("*");

      if (breaksError) throw breaksError;

      const { data: appointmentsRes, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("appointment_date", selectedDate);

      if (appointmentsError) throw appointmentsError;

      const { data: blockedRes, error: blockedError } = await supabase
        .from("blocked_times")
        .select("*")
        .eq("date", selectedDate);

      if (blockedError) throw blockedError;

      const workingHours = (workingHoursRes ?? []) as Record<string, any>[];
      const breaks = (breaksRes ?? []) as Record<string, any>[];
      const appointments = (appointmentsRes ?? []) as Record<string, any>[];
      const blockedTimes = (blockedRes ?? []) as Record<string, any>[];

      const matchedWorkingHours = workingHours.filter((row) =>
        matchesDay(row.day, selectedDateObj)
      );

      if (matchedWorkingHours.length === 0) {
        setAvailableTimes([]);
        return;
      }

      const allSlots = new Set<string>();

      for (const row of matchedWorkingHours) {
        const start = normalizeTime(row.start_time);
        const end = normalizeTime(row.end_time);

        if (!start || !end) continue;

        for (const slot of generateSlots(start, end, 15)) {
          allSlots.add(slot);
        }
      }

      const matchedBreaks = breaks.filter((row) =>
        matchesDay(row.day, selectedDateObj)
      );

      const reservedTimes = new Set(
        appointments
          .filter((row) => {
            const status = String(row.status ?? "").toLowerCase();
            return status !== "cancelled" && status !== "canceled";
          })
          .map((row) => normalizeTime(row.appointment_time))
          .filter(Boolean)
      );

      const blockedRanges = blockedTimes.map((row) => ({
        start: normalizeTime(row.start_time),
        end: normalizeTime(row.end_time),
      }));

      const filteredSlots = Array.from(allSlots)
        .filter((slot) => {
          if (reservedTimes.has(slot)) return false;

          for (const br of matchedBreaks) {
            const start = normalizeTime(br.start_time);
            const end = normalizeTime(br.end_time);
            if (!start || !end) continue;
            if (isInRange(slot, start, end)) return false;
          }

          for (const block of blockedRanges) {
            if (!block.start || !block.end) continue;
            if (isInRange(slot, block.start, block.end)) return false;
          }

          return true;
        })
        .sort();

      setAvailableTimes(filteredSlots);
    } catch (error: any) {
      showMessage(`تعذر تحميل الأوقات: ${error.message}`, "error");
    } finally {
      setIsLoadingTimes(false);
    }
  }

  async function submitBooking() {
    setMsg(null);

    if (!patientName.trim()) {
      showMessage("أدخل الاسم الكامل", "error");
      return;
    }

    if (!patientPhone.trim()) {
      showMessage("أدخل رقم الجوال", "error");
      return;
    }

    if (patientPhone.trim().length < 6) {
      showMessage("رقم الجوال غير صحيح", "error");
      return;
    }

    if (!selectedServiceId) {
      showMessage("اختر الخدمة", "error");
      return;
    }

    if (!selectedDate) {
      showMessage("اختر تاريخ الموعد", "error");
      return;
    }

    if (!selectedTime) {
      showMessage("اختر وقت الموعد", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { data: existing, error: existingError } = await supabase
        .from("appointments")
        .select("id,status")
        .eq("appointment_date", selectedDate)
        .eq("appointment_time", selectedTime)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        const status = String(existing.status ?? "").toLowerCase();
        if (status !== "cancelled" && status !== "canceled") {
          showMessage("هذا الوقت تم حجزه للتو، اختر وقتًا آخر", "error");
          await loadAvailableTimes();
          return;
        }
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          patient_name: patientName.trim(),
          patient_phone: patientPhone.trim(),
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: "pending",
          service_id: selectedServiceId,
        })
        .select("booking_number, appointment_date")
        .single();

      if (error) throw error;

      const inserted = data as BookingResult;
      const number = String(inserted.booking_number ?? "");

      setBookingNumber(number);
      setBookingModalOpen(true);

      setPatientName("");
      setPatientPhone("");
      setSelectedServiceId("");
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimes([]);
      setMsg(null);
    } catch (error: any) {
      showMessage(`فشل الحجز: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function showMessage(text: string, type: MessageType) {
    setMsg({ text, type });
  }

  const dateText = selectedDate
    ? formatDisplayDate(selectedDate)
    : "اختر التاريخ";

  return (
    <div className="section-container" style={{ maxWidth: "920px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "10px" }}>حجز موعد</h1>
        <p
          style={{
            color: "var(--text-soft)",
            fontSize: "1.02rem",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          اختاري الخدمة، حددي التاريخ، ثم اختاري الوقت المناسب وأكملي بيانات
          الحجز.
        </p>
      </div>

      {msg && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            background:
              msg.type === "error"
                ? "#fee2e2"
                : msg.type === "success"
                ? "#dcfce7"
                : "#e0f2fe",
            color:
              msg.type === "error"
                ? "#991b1b"
                : msg.type === "success"
                ? "#166534"
                : "#075985",
            fontWeight: 700,
          }}
        >
          {msg.text}
        </div>
      )}

      {/* بيانات المريض */}
      <SectionCard>
        <SectionHeader title="بيانات المريض" />

        <div style={{ display: "grid", gap: "16px" }}>
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="رقم الجوال"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            dir="ltr"
          />
        </div>
      </SectionCard>

      {/* تفاصيل الموعد */}
      <SectionCard>
        <SectionHeader title="تفاصيل الموعد" />

        <div style={{ display: "grid", gap: "16px" }}>
          {isLoadingServices ? (
            <div style={{ textAlign: "center", padding: "24px" }}>
              ⏳ جاري تحميل الخدمات...
            </div>
          ) : (
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              <option value="">اختر الخدمة</option>
              {services.map((row) => (
                <option key={row.id} value={row.id}>
                  {serviceLabel(row)}
                </option>
              ))}
            </select>
          )}

          <div style={{ display: "grid", gap: "8px" }}>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div
              style={{
                color: "var(--text-soft)",
                fontSize: "0.95rem",
                paddingRight: "4px",
              }}
            >
              {selectedDate
                ? `التاريخ المختار: ${dateText}`
                : "اختاري تاريخ الموعد"}
            </div>
          </div>

          {selectedDate && (
            <div
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "14px 16px",
                color: "var(--text-soft)",
                fontWeight: 600,
              }}
            >
              اليوم: {getDayNameArabicFromDate(selectedDate)}
            </div>
          )}
        </div>
      </SectionCard>

      {/* الأوقات المتاحة */}
      <SectionCard>
        <SectionHeader title="الأوقات المتاحة" />

        {isLoadingTimes ? (
          <div style={{ textAlign: "center", padding: "26px" }}>
            ⏳ جاري تحميل الأوقات...
          </div>
        ) : !selectedDate ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "var(--text-soft)",
            }}
          >
            اختاري تاريخ الموعد أولًا لعرض الأوقات المتاحة
          </div>
        ) : availableTimes.length === 0 ? (
          <div
            style={{
              padding: "18px",
              borderRadius: "18px",
              background: "#fff1f2",
              border: "1px solid rgba(220,38,38,0.12)",
              color: "#be123c",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            لا توجد أوقات متاحة في هذا اليوم
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {availableTimes.map((time) => {
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    style={{
                      width: "auto",
                      minWidth: "96px",
                      background: isSelected ? PRIMARY : "white",
                      color: isSelected ? "white" : "var(--text)",
                      border: isSelected
                        ? "1px solid transparent"
                        : "1px solid var(--border)",
                      boxShadow: "none",
                      padding: "11px 16px",
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "16px",
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "14px 16px",
                color: "var(--text-soft)",
                fontSize: "0.95rem",
              }}
            >
              🟢 {availableTimes.length} موعد متاح — مدة كل موعد 15 دقيقة
            </div>
          </>
        )}
      </SectionCard>

      {/* زر التأكيد */}
      <div style={{ marginTop: "18px" }}>
        <button
          type="button"
          onClick={submitBooking}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1.08rem",
            fontWeight: 800,
          }}
        >
          {isLoading ? "⏳ جاري الحجز..." : "تأكيد الحجز"}
        </button>
      </div>

      {/* ملاحظات */}
      <div className="card" style={{ marginTop: "20px", textAlign: "right" }}>
        <SectionHeader title="ملاحظات مهمة" small />
        <div style={{ color: "var(--text-soft)", lineHeight: 2 }}>
          • يرجى التأكد من الاسم ورقم الجوال قبل تأكيد الحجز
          <br />
          • اختاري خدمة وتاريخًا ووقتًا متاحًا قبل الإرسال
          <br />
          • بعد نجاح الحجز احتفظي برقم الحجز وقدميه عند الوصول
        </div>
      </div>

      {/* مودال رقم الحجز */}
      {bookingModalOpen && (
        <div
          onClick={() => setBookingModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#F6E8E5",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: PRIMARY,
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              تم تأكيد الحجز
            </div>

            <div
              style={{
                color: "#6D625E",
                lineHeight: 1.9,
                marginBottom: "18px",
              }}
            >
              احتفظ برقم الحجز واعرضه على السكرتير عند الوصول
            </div>

            <div
              style={{
                width: "100%",
                padding: "22px 20px",
                borderRadius: "22px",
                background: "#EFD9D5",
                border: "1.2px solid #D8A7A0",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#8A6E69",
                  marginBottom: "8px",
                }}
              >
                رقم الحجز
              </div>

              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  color: PRIMARY,
                  letterSpacing: "1px",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {bookingNumber}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              style={{
                width: "100%",
                padding: "14px",
                fontWeight: 800,
              }}
            >
              حسنًا
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: "20px",
        padding: "22px",
        borderRadius: "24px",
        textAlign: "right",
        border: "1.2px solid rgba(139,0,0,0.15)",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.03), 0 4px 15px rgba(139,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  small = false,
}: {
  title: string;
  small?: boolean;
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
          height: small ? "24px" : "30px",
          borderRadius: "10px",
          background: "linear-gradient(180deg, #8B0000, #C04040)",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: small ? "1.1rem" : "1.35rem",
          fontWeight: 800,
          color: "#8B0000",
        }}
      >
        {title}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  const y = date.getFullYear().toString().padStart(4, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function weekdayEnglish(date: Date) {
  const names = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return names[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

function matchesDay(dbValue: unknown, selectedDate: Date) {
  if (dbValue == null) return false;
  const value = String(dbValue).trim().toLowerCase();
  return value === weekdayEnglish(selectedDate);
}

function timeToMinutes(raw: string) {
  const cleaned = raw.trim();
  const parts = cleaned.split(":");

  if (parts.length < 2) {
    throw new Error(`تنسيق وقت غير صحيح: ${raw}`);
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  return hour * 60 + minute;
}

function normalizeTime(raw: unknown) {
  if (raw == null) return "";
  const value = String(raw).trim();
  if (!value) return "";

  const parts = value.split(":");
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, "0");
    const mm = parts[1].padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return value;
}

function generateSlots(start: string, end: string, step = 15) {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  const slots: string[] = [];

  for (let current = startMinutes; current < endMinutes; current += step) {
    const hh = String(Math.floor(current / 60)).padStart(2, "0");
    const mm = String(current % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }

  return slots;
}

function isInRange(time: string, start: string, end: string) {
  const t = timeToMinutes(time);
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return t >= s && t < e;
}

function getDayNameArabicFromDate(dateStr: string) {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return days[new Date(dateStr).getDay()];
}