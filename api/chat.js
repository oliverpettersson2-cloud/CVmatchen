import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

// Aktuell policyversion. Bumpa när integritetspolicyn ändras materiellt
// — då tvingas användare samtycka på nytt innan AI-anrop tillåts.
// Måste matcha CURRENT_POLICY_VERSION i index.html/desktop-app.js.
const CURRENT_POLICY_VERSION = '2026-06-10';

// In-memory rate limiter. Per-instans (Vercel-container) — inte global,
// så effektiv gräns är N_containers × LIMIT. Stoppar ändå en enskild
// angripare som hamrar. För hård global gräns: byt till Upstash Redis.
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;          // anrop per IP per minut
const rateBuckets = new Map();  // ip -> [timestamps]

// Cachar samtyckesstatus per-instans i 15 min för att undvika DB-hit på
// varje AI-anrop. Nyckel: userId. Värde: { hasConsent: bool, cachedAt: ms }.
const CONSENT_CACHE_MS = 15 * 60 * 1000;
const consentCache = new Map();

async function hasValidConsent(supabaseUrl, serviceKey, accessToken, userId) {
  const cached = consentCache.get(userId);
  if (cached && Date.now() - cached.cachedAt < CONSENT_CACHE_MS) {
    return cached.hasConsent;
  }
  try {
    // Verifiera att accessToken tillhör userId
    const userResp = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${accessToken}` }
    });
    if (!userResp.ok) return false;
    const userData = await userResp.json();
    if (!userData || userData.id !== userId) return false;

    // Slå upp samtycke via service-role
    const consentResp = await fetch(
      `${supabaseUrl}/rest/v1/user_consents?user_id=eq.${encodeURIComponent(userId)}&policy_version=eq.${encodeURIComponent(CURRENT_POLICY_VERSION)}&select=granted_at&limit=1`,
      { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }
    );
    if (!consentResp.ok) return false;
    const rows = await consentResp.json();
    const has = Array.isArray(rows) && rows.length > 0;
    consentCache.set(userId, { hasConsent: has, cachedAt: Date.now() });
    if (consentCache.size > 5000) {
      // Städa gamla poster
      const cutoff = Date.now() - CONSENT_CACHE_MS;
      for (const [k, v] of consentCache) {
        if (v.cachedAt < cutoff) consentCache.delete(k);
      }
    }
    return has;
  } catch (e) {
    console.error('[chat] consent check failed:', e.message);
    return false;
  }
}

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

  // Samtycke: AI-anrop tillåts bara om användaren aktivt samtyckt till
  // nuvarande policy-version. Body måste innehålla accessToken + userId
  // (UUID). Cachas per-instans i 15 min för att undvika DB-hit varje anrop.
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (supabaseUrl && serviceKey) {
    const accessToken = body.accessToken;
    const userId = body.userId;
    if (typeof accessToken !== 'string' || !uuidRe.test(String(userId || ''))) {
      return res.status(401).json({ error: 'Inloggning krävs för AI-tjänsten' });
    }
    const ok = await hasValidConsent(supabaseUrl, serviceKey, accessToken, userId);
    if (!ok) {
      return res.status(403).json({
        error: 'AI_CONSENT_REQUIRED',
        message: 'Du måste godkänna AI-behandling innan du kan använda AI-funktioner.'
      });
    }
  }

  // Ta bort auth-fält innan vi vidarebefordrar till Anthropic
  const { accessToken: _at, userId: _uid, ...forwardBody } = body;

  // Klampa max_tokens — bryter aldrig en legitim förfrågan, blockerar abuse
  const safeBody = {
    ...forwardBody,
    max_tokens: Math.min(Number(forwardBody.max_tokens) || 1024, MAX_OUTPUT_TOKENS)
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
    Sentry.captureException(error);
    console.error('[chat] Anthropic-anrop misslyckades:', error.message);
    return res.status(500).json({ error: 'AI-tjänsten är tillfälligt otillgänglig' });
  }
}
