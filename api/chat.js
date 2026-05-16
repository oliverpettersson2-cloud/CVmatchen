// In-memory rate limiter. Per-instans (Vercel-container) — inte global,
// så effektiv gräns är N_containers × LIMIT. Stoppar ändå en enskild
// angripare som hamrar. För hård global gräns: byt till Upstash Redis.
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;          // anrop per IP per minut
const rateBuckets = new Map();  // ip -> [timestamps]

function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateBuckets.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateBuckets.set(ip, hits);
  // Enkel städning så Map inte växer obegränsat
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) rateBuckets.delete(k);
    }
  }
  return hits.length > RATE_LIMIT;
}

const MAX_OUTPUT_TOKENS = 8192;       // tak — appens högsta legitima är 4000
const MAX_BODY_BYTES = 200_000;       // skydd mot gigantiska prompts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Rate limiting per IP
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'För många förfrågningar — försök igen om en stund' });
  }

  const body = req.body || {};

  // Body-storleksgräns
  if (JSON.stringify(body).length > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'Förfrågan för stor' });
  }

  // Validering: messages krävs, model måste vara en Claude-modell
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'messages krävs' });
  }
  if (typeof body.model !== 'string' || !body.model.startsWith('claude-')) {
    return res.status(400).json({ error: 'Ogiltig model' });
  }

  // Klampa max_tokens — bryter aldrig en legitim förfrågan, blockerar abuse
  const safeBody = {
    ...body,
    max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_OUTPUT_TOKENS)
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(safeBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[chat] Anthropic-anrop misslyckades:', error.message);
    return res.status(500).json({ error: 'AI-tjänsten är tillfälligt otillgänglig' });
  }
}
