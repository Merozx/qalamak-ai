'use client';

import { useState } from 'react';

export default function GeneratorClient() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [output, setOutput] = useState('النتيجة ستظهر هنا.');
  const [form, setForm] = useState({
    contentType: 'كابشن سوشيال ميديا',
    platform: 'Instagram',
    dialect: 'مصري',
    tone: 'Premium',
    product: 'كريم مرطب للوجه بمكونات طبيعية مصرية',
    audience: 'نساء من 20 إلى 35 سنة يهتمون بالعناية بالبشرة',
    offer: 'خصم 20% لأول طلب',
    length: 'متوسط',
    variants: '3',
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function generate() {
    setLoading(true);
    setStatus('جاري التوليد...');
    try {
      const payload = { ...form, variants: Number(form.variants || 3) };
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل التوليد');
      setOutput(data.result || 'لم تصل نتيجة من السيرفر.');
      setStatus(data.source === 'demo' ? 'Demo Mode — النتيجة تجريبية.' : 'تم التوليد بنجاح.');
    } catch (error) {
      setStatus(error.message || 'حدث خطأ غير متوقع.');
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    await navigator.clipboard.writeText(output);
    setStatus('تم النسخ.');
  }

  return (
    <div id="generator-root">
      <div className="form-grid">
        <Select label="نوع المحتوى" value={form.contentType} onChange={(v) => update('contentType', v)} options={['كابشن سوشيال ميديا','إعلان مدفوع','إيميل تسويقي','وصف منتج','سكريبت فيديو قصير','رسالة واتساب']} />
        <Select label="المنصة" value={form.platform} onChange={(v) => update('platform', v)} options={['Instagram','Facebook','TikTok','WhatsApp','Email','Store']} />
        <Select label="اللهجة" value={form.dialect} onChange={(v) => update('dialect', v)} options={['مصري','خليجي','سعودي','إماراتي','عربي فصيح']} />
        <Select label="النبرة" value={form.tone} onChange={(v) => update('tone', v)} options={['Premium','ودود','محترف','مثير','فكاهي','عاطفي']} />
      </div>

      <div className="field">
        <label>المنتج أو الخدمة</label>
        <textarea className="textarea" value={form.product} onChange={(e) => update('product', e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="field"><label>الجمهور المستهدف</label><input className="input" value={form.audience} onChange={(e) => update('audience', e.target.value)} /></div>
        <div className="field"><label>العرض أو الميزة</label><input className="input" value={form.offer} onChange={(e) => update('offer', e.target.value)} /></div>
      </div>

      <div className="form-grid">
        <Select label="الطول" value={form.length} onChange={(v) => update('length', v)} options={['متوسط','قصير','طويل']} />
        <Select label="عدد النتائج" value={form.variants} onChange={(v) => update('variants', v)} options={['3','2','1']} />
      </div>

      <button onClick={generate} disabled={loading} className="btn btn-primary">{loading ? 'جاري التوليد...' : 'ولّد المحتوى'}</button>
      <button onClick={copyResult} className="btn btn-outline" style={{ marginInlineStart: 10 }}>نسخ النتيجة</button>
      <div className="hint" style={{ marginTop: 12 }}>{status}</div>
      <pre className="output">{output}</pre>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}
