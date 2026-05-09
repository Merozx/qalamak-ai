export async function generateWithGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  if (!key) throw new Error('Missing GEMINI_API_KEY');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, topP: 0.9, maxOutputTokens: 1400 }
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini API failed');
  return data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
}
