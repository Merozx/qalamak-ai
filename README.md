# قلمك AI — Complete SaaS Project

مشروع SaaS كامل لمولّد محتوى عربي للمسوّقين.

## الموجود في النسخة

- Next.js 14 App Router
- UI عربي RTL حديث
- Email OTP login via Supabase
- Supabase Postgres schema
- Server-side credits
- History محفوظ في قاعدة البيانات
- Gemini API route
- Demo mode للتجربة بدون Gemini
- Lemon Squeezy checkout + webhook جاهزين
- Privacy + Terms
- Vercel-ready using pnpm

## التشغيل المحلي

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

## Supabase setup

1. أنشئ مشروع Supabase.
2. افتح SQL Editor.
3. انسخ محتوى `supabase/schema.sql` وشغّله.
4. من Authentication > Email Templates > Magic Link، اجعل القالب يستخدم:

```html
<h2>كود الدخول إلى قلمك AI</h2>
<p>استخدم هذا الكود:</p>
<h1>{{ .Token }}</h1>
```

المهم استخدام `{{ .Token }}` وليس `{{ .ConfirmationURL }}`.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEMO_MODE=true
GEMINI_MODEL=gemini-1.5-flash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

لتشغيل Gemini الحقيقي:

```env
DEMO_MODE=false
GEMINI_API_KEY=your_new_gemini_key
ALLOW_DEMO_FALLBACK=true
```

## Billing

Lemon Squeezy جاهز لكن يحتاج مفاتيحك:

```env
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_PRO_VARIANT_ID=
LEMONSQUEEZY_AGENCY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

Webhook endpoint:

```text
/api/billing/webhook
```

Checkout endpoint:

```text
/api/billing/checkout
```

## Deploy على Vercel

1. ارفع محتوى هذا الفولدر على GitHub.
2. Import Project في Vercel.
3. أضف Environment Variables.
4. Deploy.

## ملاحظات أمان

- لا ترفع `.env.local`.
- لا تشارك API keys في الشات أو GitHub.
- استخدم Supabase service role فقط في Vercel server environment.
