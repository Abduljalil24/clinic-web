import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"] });

export default function AboutPage() {
  return (
    <div className="section-container">
      {/* رأس الصفحة */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2.8rem" }}>
          عن الطبيبة
        </h1>
        <div style={{ 
          width: "100px", 
          height: "4px", 
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          margin: "20px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{ fontSize: "1.2rem", color: "var(--gray-600)", maxWidth: "600px", margin: "0 auto" }}>
          تعرفي على الدكتورة أسياء محمد ناجي واستشيريها في كل ما يخص صحتك وصحة أسرتك
        </p>
      </div>

      {/* بطاقة تعريف الطبيبة */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        marginBottom: "60px",
        background: "white",
        borderRadius: "30px",
        padding: "40px",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* صورة الطبيبة (يمكن استبدالها بصورة حقيقية) */}
        <div style={{
          background: "linear-gradient(135deg, var(--primary-light), var(--primary))",
          borderRadius: "20px",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "8rem", 
              background: "white", 
              width: "200px", 
              height: "200px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "var(--shadow-md)"
            }}>
              👩‍⚕️
            </div>
            <h3 style={{ color: "white", marginTop: "20px", fontSize: "1.8rem" }}>
              د. أسياء محمد ناجي
            </h3>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2rem" }}>
              استشارية نساء وتوليد
            </p>
          </div>
        </div>

        {/* معلومات الطبيبة */}
        <div style={{ padding: "20px" }}>
          <div style={{
            background: "var(--gray-50)",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px"
          }}>
            <h3 style={{ 
              color: "var(--primary-dark)", 
              fontSize: "1.6rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>📋</span> نبذة تعريفية
            </h3>
            <p style={{ 
              lineHeight: "1.9", 
              color: "var(--gray-700)",
              fontSize: "1.1rem"
            }}>
              دكتورة متخصصة في تقديم الرعاية الطبية الشاملة للنساء والأمهات، 
              مع خبرة تزيد عن 30 سنة في مجال النساء والولادة. نقدم رعاية متكاملة 
              تشمل متابعة الحمل والولادة الطبيعية والقيصرية، بالإضافة إلى الفحص الطبي العام 
              ومتابعة الأمراض المزمنة وتقديم الاستشارات الطبية.
            </p>
          </div>

          {/* الإحصائيات */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px"
          }}>
            {[
              { number: "+30", label: "سنوات خبرة" },
              { number: "+10000", label: "مريضة" },
              { number: "+5000", label: "ولادة" }
            ].map((stat, index) => (
              <div key={index} style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                padding: "20px 10px",
                borderRadius: "15px",
                textAlign: "center",
                color: "white"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stat.number}</div>
                <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* المؤهلات والخبرات */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "30px",
        marginBottom: "60px"
      }}>
        {/* المؤهلات العلمية */}
        <div className="card" style={{ textAlign: "right" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎓</div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "20px" }}>المؤهلات العلمية</h3>
          <ul style={{ 
            listStyle: "none", 
            padding: 0,
            lineHeight: "2.2"
          }}>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              بكالوريوس طب وجراحة - جامعة عدن
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              ماجستير النساء والتوليد
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              دبلومة الرعاية الصحية الأولية
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              زمالة السونار وأمراض الجنين
            </li>
          </ul>
        </div>

        {/* الخبرات المهنية */}
        <div className="card" style={{ textAlign: "right" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>💼</div>
          <h3 style={{ color: "var(--primary-dark)", marginBottom: "20px" }}>الخبرات المهنية</h3>
          <ul style={{ 
            listStyle: "none", 
            padding: 0,
            lineHeight: "2.2"
          }}>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              استشارية نساء وتوليد - مستشفى الولادة
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              خبرة في متابعة الحالات المزمنة
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              رعاية الحمل والولادة الطبيعية
            </li>
            <li style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)" }}>✓</span>
              استشارات تنظيم الأسرة
            </li>
          </ul>
        </div>

        {/* أوقات العمل */}
        <div className="card" style={{ textAlign: "right" }}>
        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏰</div>
        <h3 style={{ color: "var(--primary-dark)", marginBottom: "20px" }}>أوقات العمل</h3>
        
        {/* أيام العمل */}
        <div style={{ 
            background: "var(--gray-50)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px"
        }}>
            {/* السبت */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--primary)", marginLeft: "8px" }}>●</span> السبت
            </span>
            <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--gray-600)" }}>11:00 ص - 9:00 م</span>

            </div>
            </div>

            {/* الأحد */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--primary)", marginLeft: "8px" }}>●</span> الأحد
            </span>
            <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--gray-600)" }}>3:00 م - 10:00 م</span>
            </div>
            </div>

            {/* الاثنين - عطلة */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--gray-400)", marginLeft: "8px" }}>●</span> الاثنين
            </span>
            <span style={{ color: "var(--secondary)", fontWeight: "600", background: "var(--gray-100)", padding: "4px 12px", borderRadius: "20px" }}>
                ✕ عطلة
            </span>
            </div>

            {/* الثلاثاء */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--primary)", marginLeft: "8px" }}>●</span> الثلاثاء
            </span>
            <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--gray-600)" }}>3:00 م - 10:00 م</span>
            </div>
            </div>

            {/* الأربعاء */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--primary)", marginLeft: "8px" }}>●</span> الأربعاء
            </span>
            <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--gray-600)" }}>11:00 ص - 9:00 م</span>
            </div>
            </div>

            {/* الخميس - عطلة */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px dashed var(--gray-200)"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--gray-400)", marginLeft: "8px" }}>●</span> الخميس
            </span>
            <span style={{ color: "var(--secondary)", fontWeight: "600", background: "var(--gray-100)", padding: "4px 12px", borderRadius: "20px" }}>
                ✕ عطلة
            </span>
            </div>

            {/* الجمعة - عطلة */}
            <div style={{ 
            display: "flex",
            justifyContent: "space-between"
            }}>
            <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                <span style={{ color: "var(--gray-400)", marginLeft: "8px" }}>●</span> الجمعة
            </span>
            <span style={{ color: "var(--secondary)", fontWeight: "600", background: "var(--gray-100)", padding: "4px 12px", borderRadius: "20px" }}>
                ✕ عطلة
            </span>
            </div>
        </div>

        {/* وقت الراحة */}
        <div style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            border: "1px solid #fbbf24"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>☕</span>
            <div style={{ textAlign: "center" }}>
                <span style={{ fontWeight: "bold", color: "#92400e" }}>وقت الراحة اليومي:</span>
                <span style={{ color: "#92400e", marginRight: "8px" }}>2:00 م - 3:00 م</span>
            </div>
            </div>
        </div>

        {/* الاستشارات الهاتفية */}
        <div style={{ 
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            color: "white",
            textAlign: "center"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>📱</span>
            <div>
                <span style={{ fontWeight: "bold" }}>الاستشارات الهاتفية:</span>
                <span style={{ marginRight: "8px", opacity: "0.9" }}>5:00 م - 8:00 م</span>
            </div>
            </div>
        </div>

        {/* معلومات الاتصال */}
        <div style={{ 
            background: "var(--gray-50)",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            border: "2px solid var(--primary-light)"
        }}>
            <p style={{ margin: "0 0 5px 0", color: "var(--primary-dark)", fontWeight: "bold" }}>
            📞 للحجز والاستفسار
            </p>
            <p style={{ margin: 0, fontSize: "1.3rem", color: "var(--primary)", direction: "ltr" }}>
            0123456789
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "var(--gray-600)" }}>
            ✉️ clinic@example.com
            </p>
        </div>

        {/* ملخص سريع */}
        <div style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center"
        }}>
            <span style={{
            background: "var(--primary-light)",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "0.9rem"
            }}>
            السبت والأربعاء: 11ص - 9م
            </span>
            <span style={{
            background: "var(--secondary)",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "0.9rem"
            }}>
            الأحد والثلاثاء: 3م - 10م
            </span>
            <span style={{
            background: "var(--gray-600)",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "0.9rem"
            }}>
            عطلة: الاثنين - الخميس - الجمعة
            </span>
        </div>
        </div>
      </div>

      {/* قسم اللغات */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        borderRadius: "20px",
        padding: "40px",
        marginBottom: "60px",
        color: "white"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "30px",
          textAlign: "center"
        }}>
          {[
            { lang: "العربية", level: "اللغة الأم", icon: "YE" },
            { lang: "الإنجليزية", level: "ممتازة", icon: "US" },

          ].map((item, index) => (
            <div key={index}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>{item.icon}</div>
              <h4 style={{ fontSize: "1.3rem", marginBottom: "5px" }}>{item.lang}</h4>
              <p style={{ opacity: "0.9" }}>{item.level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* قسم آراء المريضات */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ textAlign: "center", color: "var(--primary-dark)", marginBottom: "40px" }}>
          آراء المريضات
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px"
        }}>
          {[
            {
              name: "أميرة محمد",
              comment: "دكتورة رائعة ومتابعة ممتازة للحمل، أشعر بالراحة والأمان معها",
              rating: 5,
              date: "٢٠٢٤"
            },
            {
              name: "نورا أحمد",
              comment: "شرح وافي وصبر في الرد على كل استفساراتي، أنصح بها بشدة",
              rating: 5,
              date: "٢٠٢٤"
            },
            {
              name: "سارة علي",
              comment: "ولادة طبيعية ممتازة بفضل متابعتها الدقيقة للحمل",
              rating: 5,
              date: "٢٠٢٣"
            }
          ].map((review, index) => (
            <div key={index} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👤</div>
              <h4 style={{ color: "var(--primary-dark)", marginBottom: "10px" }}>{review.name}</h4>
              <div style={{ color: "var(--secondary)", marginBottom: "15px" }}>
                {"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}
              </div>
              <p style={{ color: "var(--gray-600)", fontStyle: "italic", marginBottom: "15px" }}>
                "{review.comment}"
              </p>
              <small style={{ color: "var(--gray-400)" }}>{review.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* زر الحجز */}
      <div style={{ textAlign: "center" }}>
        <Link href="/book">
          <button style={{ 
            fontSize: "1.2rem", 
            padding: "16px 40px",
            background: "linear-gradient(135deg, var(--secondary), var(--secondary-light))"
          }}>
            احجزي موعداً مع الدكتورة
          </button>
        </Link>
      </div>
    </div>
  );
}