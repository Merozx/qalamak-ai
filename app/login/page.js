'use client';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { sendOtp, verifyOtp } from './actions';

const initialState = { step: 'email' };

export default function LoginPage() {
  const [state, formAction] = useFormState(state => state, initialState);
  const [emailState, sendAction] = useFormState(sendOtp, initialState);
  const [otpState, verifyAction] = useFormState(verifyOtp, { step: 'otp' });
  const current = emailState.step === 'otp' ? emailState : otpState?.email ? otpState : state;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link className="brand" href="/"><span className="logo">✦</span>قلمك AI</Link>
        <h1>تسجيل الدخول</h1>
        <p className="hint">ادخل بريدك وسيصلك كود OTP من 6 أرقام. لا توجد كلمات مرور.</p>
        {current?.error && <div className="alert error">{current.error}</div>}
        {current?.ok && <div className="alert ok">{current.ok}</div>}

        {emailState.step !== 'otp' ? (
          <form action={sendAction}>
            <div className="field"><label>البريد الإلكتروني</label><input className="input" name="email" type="email" placeholder="you@example.com" required /></div>
            <Submit label="إرسال كود الدخول" />
          </form>
        ) : (
          <form action={verifyAction}>
            <input type="hidden" name="email" value={emailState.email} />
            <div className="field"><label>البريد الإلكتروني</label><input className="input" value={emailState.email} readOnly /></div>
            <div className="field"><label>كود OTP</label><input className="input" name="token" inputMode="numeric" placeholder="123456" required /></div>
            <Submit label="دخول" />
          </form>
        )}
        <p className="hint">لو لم يصلك الكود، تأكد من Supabase Email Template واستخدم <b>{'{{ .Token }}'}</b>.</p>
      </div>
    </div>
  );
}

function Submit({ label }) {
  const { pending } = useFormStatus();
  return <button className="btn btn-primary" style={{width:'100%'}} disabled={pending}>{pending ? 'جاري التنفيذ...' : label}</button>
}
