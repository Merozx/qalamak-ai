import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { buildPrompt } from '@/lib/prompt';
import { demoGenerate } from '@/lib/ai/demo';
import { generateWithGemini } from '@/lib/ai/gemini';

export async function POST(request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const input = await request.json();
  if (!input?.product || String(input.product).trim().length < 3) {
    return NextResponse.json({ error: 'اكتب المنتج أو الخدمة بوضوح.' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: decremented, error: decError } = await admin.rpc('consume_credit', { p_user_id: user.id });
  if (decError || !decremented) {
    return NextResponse.json({ error: 'رصيدك انتهى. اشترك أو أضف Credits.' }, { status: 402 });
  }

  let result = '';
  let source = 'gemini';
  const prompt = buildPrompt(input);

  try {
    if (process.env.DEMO_MODE === 'true') {
      result = demoGenerate(input);
      source = 'demo';
    } else {
      result = await generateWithGemini(prompt);
    }
    if (!result) throw new Error('Empty AI result');

    await admin.from('generations').insert({
      user_id: user.id,
      content_type: input.contentType,
      platform: input.platform,
      dialect: input.dialect,
      tone: input.tone,
      prompt_input: input,
      result,
      source,
    });
    return NextResponse.json({ result, source });
  } catch (error) {
    await admin.rpc('refund_credit', { p_user_id: user.id });
    if (process.env.ALLOW_DEMO_FALLBACK === 'true') {
      result = demoGenerate(input);
      await admin.from('generations').insert({ user_id: user.id, content_type: input.contentType, prompt_input: input, result, source: 'fallback-demo' });
      await admin.rpc('consume_credit', { p_user_id: user.id });
      return NextResponse.json({ result, source: 'fallback-demo', warning: error.message });
    }
    return NextResponse.json({ error: error.message || 'فشل التوليد.' }, { status: 500 });
  }
}
