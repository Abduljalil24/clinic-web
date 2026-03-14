import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="section-container">
      {/* إضافة شعار العيادة بشكل بارز */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(255,215,215,0.2) 0%, rgba(255,182,193,0.1) 100%)',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '4px solid white',
          marginBottom: '20px',
          background: 'white'
        }}>
          <Image 
            src="/logo.png" 
            alt="شعار مركز آسيا الطبي"
            width={120}
            height={120}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            priority
          />
        </div>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          مركز آسيا الطبي
        </h1>
        <p style={{ fontSize: '1.3rem', color: 'var(--gray-600)' }}>
          د. أسيا محمد ناجي - استشارية نساء وتوليد
        </p>
      </div>

      {/* القسم الرئيسي المحسّن */}
      <section className="hero-section" style={{ marginTop: '20px' }}>
        <div className="hero-content">
          <h1>
            مرحباً بكم في مركز آسيا الطبي
          </h1>
          <p>
            عندما يتعلق الأمر بصحتك وصحة طفلك، فإننا في مركز الدكتورة آسيا الطبي 
            نأخذ الأمر على محمل الجد، ولا نرضى إلا بتقديم الأفضل لكِ. 
            نقدم لكِ رعاية طبية متكاملة وشاملة للمرأة في جميع مراحل حياتها، 
            في بيئة علاجية هادئة ومريحة تضمن لكِ الخصوصية والراحة النفسية.
          </p>
          <Link href="/book">
            <button style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
              احجزي موعدك الآن
            </button>
          </Link>
        </div>
      </section>

      {/* باقي الكود كما هو ... */}
      
      {/* قسم الخدمات المحسّن */}
      <section style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2>خدماتنا المتكاملة</h2>
        <div className="services-grid">
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍⚕️</div>
            <h3>متابعة الحمل</h3>
            <p>متابعة دورية وشاملة للحمل مع أحدث الأجهزة الطبية للتأكد من سلامتك وسلامة جنينك.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3>التحاليل المخبرية</h3>
            <p>جميع التحاليل الطبية الخاصة بالنساء والحمل في مختبر متكامل بنتائج دقيقة وسريعة.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3>الفحص الطبي</h3>
            <p>فحوصات دورية وشاملة للكشف المبكر عن أي مشاكل صحية وعلاجها فوراً.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
            <h3>تنظيم الأسرة</h3>
            <p>استشارات كاملة حول وسائل تنظيم الأسرة المناسبة لكل حالة.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
            <h3>التغذية السليمة</h3>
            <p>برامج تغذية مخصصة للنساء الحوامل والمرضعات.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
            <h3>متابعة ما بعد الولادة</h3>
            <p>رعاية متكاملة للأم بعد الولادة لضمان تعافيها وعودتها لحالتها الطبيعية.</p>
          </div>
        </div>
      </section>

      {/* قسم مميزات العيادة مع فيديو */}
      <section style={{ 
        marginTop: '80px', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        borderRadius: '30px',
        padding: '60px 40px',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: 'white' }}>لماذا تختارين عيادتنا؟</h2>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* الجانب الأيمن: المميزات النصية */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px'
          }}>
            {[
              { icon: '⭐', text: 'أحدث الأجهزة الطبية' },
              { icon: '👩‍⚕️', text: 'طبيبة نساء متخصصة' },
              { icon: '🏥', text: 'بيئة نظيفة وآمنة' },
              { icon: '📅', text: 'حجز مواعيد مرن' },
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* الجانب الأيسر: الفيديو */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '4px solid rgba(255,255,255,0.3)'
          }}>
            <video
              controls
              muted
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: '#000'
              }}
            >
              <source src="/videos/clinic-tour.mp4" type="video/mp4" />
              {/* يمكن إضافة مصادر إضافية للتوافق مع متصفحات مختلفة */}
              <source src="/videos/clinic-tour.webm" type="video/webm" />
              المتصفح لا يدعم تشغيل الفيديو. 
            </video>
            
            {/* شريط تعريفي أسفل الفيديو */}
            <div style={{
              padding: '15px',
              background: 'rgba(0,0,0,0.5)',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}>
              جولة سريعة في مركز آسيا الطبي - بيئة راقية وأحدث الأجهزة
            </div>
          </div>
        </div>

        {/* وصف إضافي تحت الفيديو والمميزات */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '1.2rem',
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <p style={{ margin: 0 }}>
            شاهد بنفسك بيئة العيادة المريحة والراقية التي نقدمها لكِ. 
            نضمن لكِ خصوصية تامة ورعاية صحية متكاملة.
          </p>
        </div>
      </section>

      {/* قسم دعوة للحجز */}
      <section style={{
        marginTop: '60px',
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <h2>استشيري طبيبتك الآن</h2>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--gray-600)', 
          maxWidth: '600px', 
          margin: '20px auto 30px' 
        }}>
          لا تترددي في التواصل معنا لأي استفسار أو لحجز موعد. نحن هنا لخدمتك على مدار الأسبوع.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/book">
            <button>احجزي موعداً</button>
          </Link>
          <Link href="/contact">
            <button style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)' }}>
              تواصل معنا
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}