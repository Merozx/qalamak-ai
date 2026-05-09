import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOut } from './actions';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: generations } = await supabase.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="/"><span className="logo">✦</span>قلمك AI</a>
          <form action={signOut}><button className="btn btn-outline">خروج</button></form>
        </div>
      </div>
      <main className="container dash">
        <aside className="side">
          <div className="credit">
            <span>رصيدك الحالي</span>
            <b>{profile?.credits ?? 0}</b>
            <p>Plan: {profile?.plan || 'free'}</p>
          </div>
          <div className="card" style={{marginTop:16}}>
            <h3>آخر النتائج</h3>
            <div className="history-list">
              {(generations || []).length === 0 && <p className="hint">لا توجد نتائج محفوظة بعد.</p>}
              {(generations || []).map(item => (
                <div className="history-item" key={item.id}>
                  <b>{item.content_type}</b>
                  <small>{new Date(item.created_at).toLocaleString('ar-EG')}</small>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="generator card">
          <h1>مولّد المحتوى</h1>
          <p className="hint">كل توليدة تخصم Credit واحد من السيرفر وتحفظ النتيجة في Supabase.</p>
          <Generator userEmail={user.email} />
        </section>
      </main>
    </>
  );
}

function Generator() {
  return (
    <div id="generator-root">
      <div className="form-grid">
        <div className="field"><label>نوع المحتوى</label><select id="contentType" className="select"><option>كابشن سوشيال ميديا</option><option>إعلان مدفوع</option><option>إيميل تسويقي</option><option>وصف منتج</option><option>سكريبت فيديو قصير</option><option>رسالة واتساب</option></select></div>
        <div className="field"><label>المنصة</label><select id="platform" className="select"><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>WhatsApp</option><option>Email</option><option>Store</option></select></div>
        <div className="field"><label>اللهجة</label><select id="dialect" className="select"><option>مصري</option><option>خليجي</option><option>سعودي</option><option>إماراتي</option><option>عربي فصيح</option></select></div>
        <div className="field"><label>النبرة</label><select id="tone" className="select"><option>Premium</option><option>ودود</option><option>محترف</option><option>مثير</option><option>فكاهي</option><option>عاطفي</option></select></div>
      </div>
      <div className="field"><label>المنتج أو الخدمة</label><textarea id="product" className="textarea" defaultValue="كريم مرطب للوجه بمكونات طبيعية مصرية" /></div>
      <div className="form-grid">
        <div className="field"><label>الجمهور المستهدف</label><input id="audience" className="input" defaultValue="نساء من 20 إلى 35 سنة يهتمون بالعناية بالبشرة" /></div>
        <div className="field"><label>العرض أو الميزة</label><input id="offer" className="input" defaultValue="خصم 20% لأول طلب" /></div>
      </div>
      <div className="form-grid">
        <div className="field"><label>الطول</label><select id="length" className="select"><option>متوسط</option><option>قصير</option><option>طويل</option></select></div>
        <div className="field"><label>عدد النتائج</label><select id="variants" className="select"><option>3</option><option>2</option><option>1</option></select></div>
      </div>
      <button id="generateBtn" className="btn btn-primary">ولّد المحتوى</button>
      <button id="copyBtn" className="btn btn-outline" style={{marginInlineStart:10}}>نسخ النتيجة</button>
      <div id="status" className="hint" style={{marginTop:12}}></div>
      <pre id="output" className="output">النتيجة ستظهر هنا.</pre>
      <script dangerouslySetInnerHTML={{__html: `
        const $ = (id) => document.getElementById(id);
        $('generateBtn').addEventListener('click', async () => {
          $('status').textContent = 'جاري التوليد...';
          $('generateBtn').disabled = true;
          try {
            const payload = {
              contentType: $('contentType').value, platform: $('platform').value, dialect: $('dialect').value,
              tone: $('tone').value, product: $('product').value, audience: $('audience').value,
              offer: $('offer').value, length: $('length').value, variants: Number($('variants').value)
            };
            const res = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'فشل التوليد');
            $('output').textContent = data.result;
            $('status').textContent = data.source === 'demo' ? 'Demo Mode — النتيجة تجريبية.' : 'تم التوليد بنجاح.';
          } catch (e) { $('status').textContent = e.message; }
          finally { $('generateBtn').disabled = false; }
        });
        $('copyBtn').addEventListener('click', async () => { await navigator.clipboard.writeText($('output').textContent); $('status').textContent='تم النسخ.'; });
      `}} />
    </div>
  );
}
