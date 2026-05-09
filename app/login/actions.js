'use server';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function sendOtp(prev, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) return { step: 'email', error: 'اكتب البريد الإلكتروني.' };
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard` },
  });
  if (error) return { step: 'email', error: error.message };
  return { step: 'otp', email, ok: 'تم إرسال كود الدخول. راجع بريدك.' };
}

export async function verifyOtp(prev, formData) {
  const email = String(formData.get('email') || prev?.email || '').trim().toLowerCase();
  const token = String(formData.get('token') || '').trim();
  if (!email || !token) return { step: 'otp', email, error: 'اكتب البريد والكود.' };
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) return { step: 'otp', email, error: 'الكود غير صحيح أو انتهت صلاحيته.' };
  redirect('/dashboard');
}
