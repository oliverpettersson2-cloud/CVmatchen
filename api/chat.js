import * as Sentry from '@sentry/node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

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

// ============================================================================
// AI-rutt: AWS Bedrock (EU) om konfigurerat, annars Anthropics API.
//
// GDPR: Bedrock-EU håller CV-data inom EU/EES, lagrar inget efter anropet och
// tränar inga modeller. Anthropics direkt-API (USA) är fallback.
//
// Aktiveras när Bedrock-auth finns OCH modellen är mappad via env. Vi hårdkodar
// INGA modell-ID:n här — EU-inference-profilerna sätts som env-variabler så att
// rätt ID alltid kommer från Bedrock-konsolen, aldrig från en gissning i koden.
//
// Auth (välj EN — SDK:n plockar upp dem automatiskt):
//   AWS_BEARER_TOKEN_BEDROCK  ← Bedrock API-nyckel (enklast, redan satt i Vercel)
//   ELLER  AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY  (klassiska IAM-nycklar)
// Region & modeller (EU geo-inference-profiler, källa: AWS modellkort):
//   AWS_REGION           = eu-central-1   (källregion; geo-EU routar bara inom EU)
//   BEDROCK_MODEL_SONNET = eu.anthropic.claude-sonnet-4-6
//   BEDROCK_MODEL_HAIKU  = eu.anthropic.claude-haiku-4-5-20251001-v1:0
//
// BEDROCK_STRICT=1  → fail-closed: faller ALDRIG tillbaka till Anthropic/USA.
//                     Sätt detta för kommun-driften så persondata aldrig läcker.
// ============================================================================
const BEDROCK_REGION = process.env.AWS_REGION || 'eu-central-1';
const BEDROCK_STRICT = process.env.BEDROCK_STRICT === '1';
const BEDROCK_MODELS = {
  'claude-sonnet-4-6': process.env.BEDROCK_MODEL_SONNET,
  'claude-haiku-4-5-20251001': process.env.BEDROCK_MODEL_HAIKU,
};
const BEDROCK_CREDS = !!(
  process.env.AWS_BEARER_TOKEN_BEDROCK ||
  (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
);

let _bedrock = null;
function bedrockClient() {
  if (!_bedrock) _bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION });
  return _bedrock;
}

// Anropa Bedrock. Frontend skickar Anthropic-format ({model, max_tokens, system,
// messages, ...}); Bedrock vill ha samma kropp UTAN `model` (det går som modelId)
// och MED anthropic_version. Svaret har samma form som Anthropic Messages-API.
async function callBedrock(safeBody) {
  const modelId = BEDROCK_MODELS[safeBody.model];
  if (!modelId) throw new Error(`Ingen Bedrock-modell mappad för "${safeBody.model}"`);
  const { model, ...rest } = safeBody;
  const payload = { anthropic_version: 'bedrock-2023-05-31', ...rest };
  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });
  const out = await bedrockClient().send(command);
  return JSON.parse(new TextDecoder().decode(out.body));
}

// Anropa Anthropics API direkt (USA). Kastar { httpStatus, body } vid fel så
// att handlern kan spegla Anthropics statuskod, precis som tidigare.
async function callAnthropic(safeBody) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw { httpStatus: 500, body: { error: 'API key not configured' } };
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(safeBody),
  });
  const data = await response.json();
  if (!response.ok) throw { httpStatus: response.status, body: data };
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Minst en AI-väg måste vara konfigurerad
  if (!BEDROCK_CREDS && !process.env.ANTHROPIC_API_KEY) {
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
    max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_OUTPUT_TOKENS),
  };

  // Använd Bedrock-EU om auth finns OCH modellen är mappad
  const useBedrock = BEDROCK_CREDS && !!BEDROCK_MODELS[safeBody.model];

  // STRICT = aldrig USA. Om Bedrock inte kan köras (auth eller modell-ID saknas)
  // får vi INTE tyst falla tillbaka till Anthropic — då fail-closar vi istället.
  if (BEDROCK_STRICT && !useBedrock) {
    console.error('[chat] BEDROCK_STRICT men Bedrock ej körbar (auth/modell-ID saknas) för', safeBody.model);
    return res.status(502).json({ error: 'AI-tjänsten (EU) är inte färdigkonfigurerad' });
  }

  try {
    let data;
    if (useBedrock) {
      try {
        data = await callBedrock(safeBody);
      } catch (bedrockErr) {
        Sentry.captureException(bedrockErr);
        console.error('[chat] Bedrock-anrop misslyckades:', bedrockErr.message);
        // Fail-closed för kommun-drift: läck aldrig till USA som fallback
        if (BEDROCK_STRICT || !process.env.ANTHROPIC_API_KEY) {
          return res.status(502).json({ error: 'AI-tjänsten (EU) är tillfälligt otillgänglig' });
        }
        data = await callAnthropic(safeBody);
      }
    } else {
      data = await callAnthropic(safeBody);
    }
    return res.status(200).json(data);
  } catch (error) {
    if (error && error.httpStatus) {
      return res.status(error.httpStatus).json(error.body);
    }
    Sentry.captureException(error);
    console.error('[chat] AI-anrop misslyckades:', error.message);
    return res.status(500).json({ error: 'AI-tjänsten är tillfälligt otillgänglig' });
  }
}
