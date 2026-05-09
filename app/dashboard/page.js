import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOut } from './actions';
import GeneratorClient from './GeneratorClient';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

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
          <div className="card" style={{ marginTop: 16 }}>
            <h3>آخر النتائج</h3>
            <div className="history-list">
              {(generations || []).length === 0 && <p className="hint">لا توجد نتائج محفوظة بعد.</p>}
              {(generations || []).map((item) => (
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
          <GeneratorClient />
        </section>
      </main>
    </>
  );
}
