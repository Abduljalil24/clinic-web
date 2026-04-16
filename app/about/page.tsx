import Link from "next/link";
import Image from "next/image";

const doctors = [
  {
    name: "د. آسيا محمد ناجي",
    specialty: "استشارية امراض وجراحة نساء وولادة وعقم",
    image: "/doctors/asia.jpg",
    phone: "771658590",
    workTimes: [
      {
        day: "السبت والأربعاء",
        time: "من الساعة 11 صباحًا حتى الساعة 9 مساءً",
      },
      {
        day: "الأحد والثلاثاء",
        time: "من الساعة 3 عصرًا حتى الساعة 10 مساءً",
      },
    ],
  },
  {
    name: "د. رشاء محمد علي",
    specialty: "اخصائية امراض وجراحة نساء وولادة",
    image: "/doctors/rasha.jpeg",
    phone: "777617111",
    workTimes: [
      {
        day: "السبت والأربعاء",
        time: "من الساعة 11 صباحًا حتى الساعة 9 مساءً",
      },
      {
        day: "الأحد والثلاثاء",
        time: "من الساعة 3 عصرًا حتى الساعة 10 مساءً",
      },
    ],
  },
];

function WorkTimeItem({ day, time }: { day: string; time: string }) {
  return (
    <div
      style={{
        marginBottom: "12px",
        padding: "16px",
        background: "var(--bg-soft)",
        borderRadius: "18px",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "15px",
          background:
            "linear-gradient(135deg, rgba(139,0,0,0.12), rgba(139,0,0,0.05))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          flexShrink: 0,
          border: "1px solid rgba(139,0,0,0.10)",
        }}
      >
        ⏰
      </div>

      <div>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: "var(--primary)",
            marginBottom: "4px",
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontSize: "0.95rem",
            color: "var(--text-soft)",
            lineHeight: 1.8,
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${phone}`}
      style={{
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          marginBottom: "14px",
          padding: "16px",
          background: "var(--bg-soft)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "15px",
            background:
              "linear-gradient(135deg, rgba(139,0,0,0.12), rgba(139,0,0,0.05))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            flexShrink: 0,
            border: "1px solid rgba(139,0,0,0.10)",
          }}
        >
          📞
        </div>

        <div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--primary)",
              marginBottom: "4px",
            }}
          >
            للتواصل والاستفسار
          </div>
          <div
            style={{
              fontSize: "0.98rem",
              color: "var(--text)",
              lineHeight: 1.8,
              direction: "ltr",
              fontWeight: 700,
            }}
          >
            {phone}
          </div>
        </div>
      </div>
    </a>
  );
}

function DoctorCard({
  name,
  specialty,
  image,
  phone,
  workTimes,
}: {
  name: string;
  specialty: string;
  image: string;
  phone: string;
  workTimes: { day: string; time: string }[];
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        borderRadius: "26px",
        padding: "24px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        style={{
          width: "138px",
          height: "138px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          padding: "10px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.75), rgba(255,255,255,0.20))",
          boxShadow: "0 14px 28px rgba(139,0,0,0.12)",
          border: "1px solid rgba(139,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#fff",
            position: "relative",
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="138px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: "1.65rem",
          fontWeight: 800,
          color: "var(--primary)",
          marginBottom: "12px",
          lineHeight: 1.5,
        }}
      >
        {name}
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "11px 18px",
          borderRadius: "999px",
          background: "#fafafa",
          border: "1px solid var(--border)",
          color: "var(--text)",
          fontWeight: 700,
          fontSize: "0.98rem",
          marginBottom: "24px",
        }}
      >
        {specialty}
      </div>

      <div style={{ textAlign: "right", marginBottom: "14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "28px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, var(--primary), var(--secondary))",
            }}
          />
          <div
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--primary)",
            }}
          >
            أوقات العمل
          </div>
        </div>

        {workTimes.map((item, index) => (
          <WorkTimeItem key={index} day={item.day} time={item.time} />
        ))}

        <ContactItem phone={phone} />
      </div>

      <Link
        href="/book"
        style={{
          display: "inline-flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "15px 22px",
          borderRadius: "999px",
          background: "var(--primary)",
          color: "white",
          fontWeight: 800,
          fontSize: "1rem",
          boxShadow: "0 10px 24px rgba(139,0,0,0.18)",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>📅</span>
        حجز موعد
      </Link>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="section-container">
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <h1 style={{ marginBottom: "10px" }}>الطبيبات</h1>
        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            color: "var(--text-soft)",
            fontSize: "1.05rem",
            lineHeight: 1.9,
          }}
        >
          تعرفي على الطبيبات العاملات في مركز آسيا الطبي، واطلعي على التخصصات
          وأوقات العمل ووسائل التواصل والاستفسار.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "22px",
        }}
      >
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={index}
            name={doctor.name}
            specialty={doctor.specialty}
            image={doctor.image}
            phone={doctor.phone}
            workTimes={doctor.workTimes}
          />
        ))}
      </div>
    </div>
  );
}