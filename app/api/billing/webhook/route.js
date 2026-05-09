import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { PLANS, getPlanByVariant } from '@/lib/plans';

function verifySignature(raw, signature) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const digest = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature || ''));
}

export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get('x-signature');
  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  const event = JSON.parse(raw);
  const eventName = event?.meta?.event_name;
  const custom = event?.meta?.custom_data || event?.data?.attributes?.custom_data || {};
  const userId = custom.user_id;
  const variantId = String(event?.data?.attributes?.variant_id || '');
  const plan = custom.plan || getPlanByVariant(variantId);
  if (!userId || !plan || !PLANS[plan]) return NextResponse.json({ received: true, ignored: true });

  const admin = createSupabaseAdminClient();
  if (['subscription_created', 'subscription_updated', 'order_created'].includes(eventName)) {
    await admin.from('profiles').update({ plan, credits: PLANS[plan].monthlyCredits, updated_at: new Date().toISOString() }).eq('id', userId);
    await admin.from('subscriptions').upsert({
      user_id: userId,
      provider: 'lemonsqueezy',
      provider_customer_id: String(event?.data?.attributes?.customer_id || ''),
      provider_subscription_id: String(event?.data?.id || ''),
      plan,
      status: event?.data?.attributes?.status || 'active',
      raw_event: event,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'provider_subscription_id' });
  }
  if (['subscription_cancelled', 'subscription_expired'].includes(eventName)) {
    await admin.from('profiles').update({ plan: 'free', updated_at: new Date().toISOString() }).eq('id', userId);
  }
  return NextResponse.json({ received: true });
}
