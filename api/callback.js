// Серверная функция: принимает заявки с сайта (обратный звонок, обновление
// цен из admin.html) и пересылает их в Telegram. Токен бота хранится ТОЛЬКО
// здесь — в переменных окружения хостинга, а не в коде страниц.
//
// Настройка (пример для Vercel):
//   Project → Settings → Environment Variables
//     TELEGRAM_BOT_TOKEN = <новый токен, полученный заново у @BotFather>
//     TELEGRAM_CHAT_ID   = 40272357
//
// ВАЖНО: старый токен 8527453061:AAGHfFHEn7zOgXI84O3YXM9Iw1fPgPzV1gA был
// виден в открытом исходном коде сайта — считайте его скомпрометированным
// и отзовите через @BotFather (/revoke) до включения этой функции в работу.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    res.status(500).json({ ok: false, error: 'Server is not configured (missing env vars)' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const isPriceUpdate = body.type === 'price_update';

    // Простая защита от пустых/слишком длинных запросов
    const text = String(body.text || '').slice(0, 3500);
    if (!text.trim()) {
      res.status(400).json({ ok: false, error: 'Empty text' });
      return;
    }

    const payload = { chat_id: CHAT_ID, text };
    if (isPriceUpdate) payload.parse_mode = 'Markdown';

    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await tgRes.json();

    if (!data.ok) { res.status(502).json({ ok: false, error: data.description || 'Telegram error' }); return; }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
