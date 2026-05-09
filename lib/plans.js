export const PLANS = {
  free: { name: 'Free', monthlyCredits: 10 },
  pro: { name: 'Pro', monthlyCredits: 500 },
  agency: { name: 'Agency', monthlyCredits: 2500 },
};

export function getPlanByVariant(variantId) {
  if (variantId && variantId === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) return 'pro';
  if (variantId && variantId === process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID) return 'agency';
  return null;
}
