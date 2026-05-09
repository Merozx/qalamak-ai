import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const VARIANTS = {
  pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
  agency: process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID,
};

export async function POST(request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { plan = 'pro' } = await request.json();
  const variantId = VARIANTS[plan];
  if (!process.env.LEMONSQUEEZY_API_KEY || !process.env.LEMONSQUEEZY_STORE_ID || !variantId) {
    return NextResponse.json({ error: 'Billing is not configured yet.' }, { status: 400 });
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email: user.email, custom: { user_id: user.id, plan } },
          product_options: { redirect_url: `${siteUrl}/dashboard` },
        },
        relationships: {
          store: { data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID) } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.errors?.[0]?.detail || 'Checkout failed' }, { status: 500 });
  return NextResponse.json({ url: data?.data?.attributes?.url });
}
