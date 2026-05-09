export function demoGenerate(input) {
  const product = input.product || 'منتجك';
  const dialectNote = input.dialect === 'مصري' ? 'بأسلوب مصري قريب من الناس' : input.dialect === 'عربي فصيح' ? 'بلغة عربية واضحة' : 'بنبرة خليجية راقية';
  return `نتيجة 1:\n${product} مش مجرد اختيار عادي — ده حل عملي لجمهورك. ${input.offer || 'استفد من العرض الحالي'} وابدأ تجربة مختلفة اليوم.\nCTA: اطلب الآن.\n\nنتيجة 2:\nلو جمهورك محتاج نتيجة واضحة من غير كلام كتير، ${product} يقدم قيمة مباشرة ${dialectNote}. مناسب لـ ${input.platform}.\nCTA: جرّبه اليوم.\n\nنتيجة 3:\nحوّل اهتمام العميل لقرار شراء مع رسالة بسيطة: ${product} مصمم لاحتياج ${input.audience || 'عملائك'}، ومع ${input.offer || 'ميزة واضحة'} القرار أسهل.\nCTA: احجز/اطلب الآن.`;
}
