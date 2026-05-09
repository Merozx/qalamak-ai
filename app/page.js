import Link from 'next/link';

const features = [
  ['⚡', 'توليد سريع', '3 نتائج مختلفة لكل طلب، جاهزة للنسخ والنشر.'],
  ['🇪🇬', 'لهجات عربية', 'مصري، خليجي، سعودي، إماراتي، وفصيح بدون ترجمة حرفية.'],
  ['📈', 'مخصص للبيع', 'Hook، فوائد، CTA، وهاشتاجات حسب المنصة والجمهور.'],
  ['🔐', 'حسابات وCredits', 'كل مستخدم له رصيد وسجل محفوظ في قاعدة البيانات.'],
  ['🧾', 'History', 'حفظ آخر التوليدات والرجوع لها من الداشبورد.'],
  ['💳', 'Billing Ready', 'ملفات Checkout وWebhook جاهزة للربط مع Lemon Squeezy.'],
];

export default function HomePage() {
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link className="brand" href="/"><span className="logo">✦</span>قلمك AI</Link>
          <div className="nav-links">
            <a href="#features">المميزات</a>
            <a href="#pricing">الأسعار</a>
            <Link href="/login" className="btn btn-outline">تسجيل الدخول</Link>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div>
            <span className="badge">🚀 SaaS عربي جاهز للبداية</span>
            <h1 className="h1">محتوى تسويقي عربي <span>يبيع</span> في ثواني</h1>
            <p className="lead">منصة توليد محتوى للمسوّقين وأصحاب المتاجر: كابشنات، إعلانات، إيميلات، وصف منتجات، واتساب، وسكريبت فيديو باللهجات العربية.</p>
            <div className="hero-actions">
              <Link href="/login" className="btn btn-primary">ابدأ مجانًا</Link>
              <Link href="/pricing" className="btn btn-outline">شاهد الأسعار</Link>
            </div>
            <div className="stats">
              <div className="stat"><b>10</b><small>Credits مجانية</small></div>
              <div className="stat"><b>6</b><small>أنواع محتوى</small></div>
              <div className="stat"><b>OTP</b><small>تسجيل آمن</small></div>
            </div>
          </div>

          <div className="glass">
            <div className="preview-head"><b>Dashboard Preview</b><div className="dots"><span className="dot"/><span className="dot"/><span className="dot"/></div></div>
            <div className="preview">
              <div className="mini-grid">
                <div className="mini-card"><b>نوع المحتوى</b><span className="pill">إعلان مدفوع</span></div>
                <div className="mini-card"><b>اللهجة</b><span className="pill">مصري</span></div>
                <div className="mini-card"><b>النبرة</b><span className="pill">Premium</span></div>
                <div className="mini-card"><b>المنصة</b><span className="pill">Instagram</span></div>
              </div>
              <div className="result-box">
                خطّاف: بشرتك تستحق عناية مختلفة…<br />
                نص الإعلان: كريم طبيعي بتركيبة خفيفة يناسب الاستخدام اليومي ويمنح ترطيبًا واضحًا بدون ملمس دهني.<br />
                CTA: اطلبيه الآن واستفيدي من عرض الإطلاق.
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="features" className="section">
        <div className="container">
          <div className="section-title"><h2>من Demo إلى SaaS فعلي</h2><p>هذه النسخة ليست صفحة فقط؛ فيها Auth وDatabase وCredits وAPI route وفواتير جاهزة للربط.</p></div>
          <div className="cards">{features.map(([icon,title,body]) => <div className="card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{body}</p></div>)}</div>
        </div>
      </section>

      <section id="pricing" className="section" style={{background:'#f3f0e8'}}>
        <div className="container">
          <div className="section-title"><h2>باقات واضحة</h2><p>تبدأ مجانًا، ثم تربط الدفع عندما تكون جاهزًا للبيع.</p></div>
          <div className="pricing">
            <Plan name="Free" price="$0" items={['10 Credits عند التسجيل','History محفوظ','OTP Login']} />
            <Plan featured name="Pro" price="$9" items={['500 Credits شهريًا','كل أنواع المحتوى','أولوية في الجودة']} />
            <Plan name="Agency" price="$29" items={['2500 Credits شهريًا','مناسب للفرق','Billing webhook جاهز']} />
          </div>
        </div>
      </section>

      <footer className="footer">© 2026 قلمك AI — SaaS عربي للمحتوى التسويقي</footer>
    </>
  );
}

function Plan({ name, price, items, featured }) {
  return <div className={`card price ${featured ? 'featured' : ''}`}><h3>{name}</h3><div className="price-tag">{price}</div><div className="list">{items.map(i => <span key={i}>✓ {i}</span>)}</div><Link href="/login" className={featured ? 'btn btn-primary' : 'btn btn-outline'}>ابدأ الآن</Link></div>
}
