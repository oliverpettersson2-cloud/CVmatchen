import https from 'https';
import crypto from 'crypto';
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

// Maskerar PII (email, telefonnummer) innan det hamnar i Vercel-loggar.
function maskPII(value) {
  let s = typeof value === 'string' ? value : JSON.stringify(value);
  if (!s) return s;
  s = s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]');
  s = s.replace(/(?<!\d)(\+?\d[\d\s-]{7,}\d)(?!\d)/g, '[tel]');
  return s;
}

// ============================================================================
// Rate limiting för OTP — samma in-memory-mönster som api/chat.js.
// Per-instans (Vercel-container), inte global. Cold-start nollställer,
// men det är ok som första försvar. Skyddar mot e-post-bombning och
// OTP-bruteforce. För hård global gräns: byt till Upstash Redis.
// ============================================================================
const OTP_SEND_EMAIL_WINDOW_MS = 60 * 60 * 1000;   // 1 timme
const OTP_SEND_EMAIL_LIMIT = 3;                    // OTP per e-post per timme
const OTP_SEND_IP_WINDOW_MS = 60 * 60 * 1000;      // 1 timme
const OTP_SEND_IP_LIMIT = 10;                      // OTP per IP per timme
const OTP_VERIFY_WINDOW_MS = 15 * 60 * 1000;       // 15 minuter
const OTP_VERIFY_LIMIT = 5;                        // försök per e-post per 15 min

const otpSendEmailBuckets = new Map();   // email -> [timestamps]
const otpSendIpBuckets = new Map();      // ip    -> [timestamps]
const otpVerifyEmailBuckets = new Map(); // email -> [timestamps]

function bucketHit(map, key, windowMs, limit) {
  const now = Date.now();
  const hits = (map.get(key) || []).filter(t => now - t < windowMs);
  hits.push(now);
  map.set(key, hits);
  // Enkel städning så Map inte växer obegränsat
  if (map.size > 5000) {
    for (const [k, v] of map) {
      if (!v.length || now - v[v.length - 1] > windowMs) map.delete(k);
    }
  }
  return hits.length > limit;
}

// Enkel e-post-regex — tillräcklig för att blockera trams innan vi
// ringer Supabase Auth (enumerationsskydd).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================================
// log_event — tillåtna event-typer och storleksgräns
// ============================================================================
const ALLOWED_EVENTS = new Set([
  // Auth
  'login', 'logout',
  // CV-bygge
  'cv_created', 'cv_saved', 'cv_exported', 'profile_generated',
  // Matchning
  'cv_matched', 'cv_saved_from_match',
  // AI
  'ai_skill_match', 'ai_cv_analysis', 'syv_chat',
  // Utbildning
  'edu_saved', 'edu_removed',
  // Sök
  'job_search',
  // Handläggare
  'task_assigned', 'task_completed',
]);
const MAX_METADATA_BYTES = 4096;

// ============================================================================
// OTP rate-limit (per e-post, per timme)
// ----------------------------------------------------------------------------
// In-memory broms mot OTP-bombning. Nollställs vid Vercel cold start, men
// räcker som första lager mot enkel abuse. Hård gräns vid Supabase Auth tar
// resten. Max 3 send_otp per e-post under ett rullande 1h-fönster.
// ============================================================================
const OTP_RATE_WINDOW_MS = 60 * 60 * 1000;
const OTP_RATE_MAX = 3;
const otpRateMap = new Map(); // key: lowercased email, value: number[] (timestamps ms)
function otpRateAllow(email) {
  const key = String(email || '').toLowerCase();
  if (!key) return true;
  const now = Date.now();
  const cutoff = now - OTP_RATE_WINDOW_MS;
  const arr = (otpRateMap.get(key) || []).filter(ts => ts > cutoff);
  if (arr.length >= OTP_RATE_MAX) {
    otpRateMap.set(key, arr);
    return false;
  }
  arr.push(now);
  otpRateMap.set(key, arr);
  // Lazy GC: rensa map om den växer för stor
  if (otpRateMap.size > 5000) {
    for (const [k, v] of otpRateMap) {
      const kept = v.filter(ts => ts > cutoff);
      if (kept.length === 0) otpRateMap.delete(k);
      else otpRateMap.set(k, kept);
    }
  }
  return true;
}

// Tillåtna roller vid invite. 'superadmin' tilldelas aldrig via invite-flödet
// (säkerhetsspärr — superadmin sätts manuellt eller via seed_superadmin).
const INVITE_ALLOWED_ROLES = new Set(['admin', 'handlaggare', 'invanare']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const { action, email, token, accessToken, userId, cvData, table, data,
    adminEmail, taskId, params: tParams,
    title, description, category, deadline, durationMinutes, note,
    targetUserId, role, kommunId, enhetId, name: personName,
    filters, phone: personPhone,
    event_type, metadata,
    inviteId, seedToken
  } = req.body || {};

  function makeRequest(url, options, body) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const reqOptions = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 10000
      };
      const req = https.request(reqOptions, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try { resolve({ status: response.statusCode, data: JSON.parse(data) }); }
          catch(e) { resolve({ status: response.statusCode, data: { raw: data } }); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
      req.end();
    });
  }

  const baseHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  };
  function authHeaders(t) { return { ...baseHeaders, 'Authorization': `Bearer ${t}` }; }
  function serviceHeaders() {
    const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
    return { ...baseHeaders, 'apikey': key, 'Authorization': `Bearer ${key}` };
  }

  // ════════════════════════════════════════════════════════════════
  // verifyAdmin — multi-tenant-skydd för admin_*-actions.
  // HMAC-verifierar handläggarens session-token (samma signering som
  // api/v1/auth/callback.js + refresh.js), slår upp admin-raden färskt
  // ur DB (källa-på-sanning för kommun/enhet/roll), och säkerställer att
  // begärd kommun/enhet/användare ligger inom adminens behörighet.
  // Kastar { status, msg } vid fel. Returnerar verifierad admin-rad.
  // ════════════════════════════════════════════════════════════════
  async function verifyAdmin(token, opts = {}) {
    const secret = process.env.MICROSOFT_CLIENT_SECRET;
    if (!secret) throw { status: 500, msg: 'config_missing' };
    if (!token || typeof token !== 'string') throw { status: 401, msg: 'no_token' };

    const parts = token.split('.');
    if (parts.length !== 2) throw { status: 401, msg: 'invalid_token_format' };
    const [payloadB64, sig] = parts;
    const expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (sig.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      throw { status: 401, msg: 'invalid_signature' };
    }

    let payload;
    try { payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')); }
    catch { throw { status: 401, msg: 'invalid_payload' }; }
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      throw { status: 401, msg: 'expired' };
    }

    const adminRes = await makeRequest(
      `${SUPABASE_URL}/rest/v1/admins?id=eq.${encodeURIComponent(payload.adminId)}&select=id,email,role,kommun_id,enhet_id&limit=1`,
      { method: 'GET', headers: serviceHeaders() }
    );
    const rows = Array.isArray(adminRes.data) ? adminRes.data : [];
    if (!rows.length) throw { status: 401, msg: 'admin_revoked' };
    const admin = rows[0];
    const isSuper = admin.role === 'superadmin';

    if (!isSuper) {
      if (opts.requestedKommunId != null &&
          String(opts.requestedKommunId) !== String(admin.kommun_id)) {
        throw { status: 403, msg: 'forbidden_kommun', admin };
      }
      if (opts.requestedEnhetId != null && admin.enhet_id != null &&
          String(opts.requestedEnhetId) !== String(admin.enhet_id)) {
        throw { status: 403, msg: 'forbidden_enhet', admin };
      }
    }

    if (opts.requestedUserId) {
      const uaRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(opts.requestedUserId)}&select=kommun_id,enhet_id&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const uas = Array.isArray(uaRes.data) ? uaRes.data : [];
      if (!uas.length) throw { status: 404, msg: 'user_not_found', admin };
      if (!isSuper && String(uas[0].kommun_id) !== String(admin.kommun_id)) {
        throw { status: 403, msg: 'cross_tenant_user', admin };
      }
    }

    return admin;
  }

  // Loggar nekade admin-försök till admin_activity_log (forensik vid
  // misstänkt cross-tenant-åtkomst). Blockerar aldrig svaret.
  async function logAdminDenied(adminId, action, msg) {
    try {
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/admin_activity_log`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { admin_id: adminId || null, action: 'access_denied', detail: `${action}: ${msg}` }
      );
    } catch (e) { /* loggning får inte blockera */ }
  }

  // Loggar lyckad admin-åtgärd till admin_activity_log. Samma forensik-spår
  // som logAdminDenied men med action='success'-prefix så att granskning kan
  // skilja på beviljade/nekade försök. Blockerar aldrig svaret.
  async function logAdminAction(adminId, action, detail) {
    try {
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/admin_activity_log`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { admin_id: adminId || null, action, detail: detail || null }
      );
    } catch (e) { /* loggning får inte blockera */ }
  }

  // Validerar grov e-postform. Inte RFC-perfekt men räcker som sanity-check
  // innan vi skickar vidare till Supabase Auth / sparar i DB.
  function isEmail(s) {
    return typeof s === 'string' &&
      s.length <= 254 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  // Validerar UUID v4-form (PostgREST-injektionsskydd, samma som isUuid nedan
  // men deklareras tidigare så att admin_invite_user/admin_revoke_invite kan
  // kontrollera inviteId före verifyAdmin-anropet.)
  function isUuidStrict(s) {
    return typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
  }

  // Wrappar verifyAdmin: returnerar { admin } eller skickar HTTP-fel + loggar.
  async function requireAdmin(res, token, action, opts = {}) {
    try {
      const admin = await verifyAdmin(token, opts);
      return { admin };
    } catch (e) {
      const status = e.status || 401;
      if (status === 403) await logAdminDenied(e.admin?.id, action, e.msg);
      res.status(status).json({ error: e.msg || 'unauthorized' });
      return { admin: null };
    }
  }

  // Verifierar att accessToken tillhör userId. Returnerar { ok: true, user }
  // eller skickar HTTP-fel och returnerar { ok: false }. Skydd mot att en
  // inloggad användare skickar någon annans userId i request-body.
  async function requireUser(res, accessToken, userId) {
    if (!accessToken || !userId) {
      res.status(400).json({ error: 'accessToken och userId krävs' });
      return { ok: false };
    }
    const userRes = await makeRequest(`${SUPABASE_URL}/auth/v1/user`, { method: 'GET', headers: authHeaders(accessToken) });
    if (userRes.status >= 400 || !userRes.data || !userRes.data.id) {
      res.status(401).json({ error: 'Ogiltig access_token' });
      return { ok: false };
    }
    if (userRes.data.id !== userId) {
      res.status(403).json({ error: 'user_id matchar inte access_token' });
      return { ok: false };
    }
    return { ok: true, user: userRes.data };
  }

  // Validerar att en sträng ser ut som ett Supabase-UUID. Skydd mot
  // PostgREST-injektion via okontrollerade query-värden.
  function isUuid(s) {
    return typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
  }

  try {

    if (action === 'send_otp') {
      // Validera e-post-format innan vi anropar Supabase Auth — annars
      // kan endpoint missbrukas för enumerations-/spam-svar.
      if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Ogiltig e-postadress' });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
        || req.headers['x-real-ip'] || 'unknown';

      // Per-e-post: skydda godtycklig användare mot mail-bombning
      if (bucketHit(otpSendEmailBuckets, normalizedEmail, OTP_SEND_EMAIL_WINDOW_MS, OTP_SEND_EMAIL_LIMIT)) {
        console.warn('[send_otp] 429 email-limit ' + maskPII(normalizedEmail));
        res.setHeader('Retry-After', '3600');
        return res.status(429).json({ error: 'För många koder skickade till denna e-post — försök igen senare' });
      }
      // Per-IP: skydda mot bredare missbruk från en angripare
      if (bucketHit(otpSendIpBuckets, ip, OTP_SEND_IP_WINDOW_MS, OTP_SEND_IP_LIMIT)) {
        console.warn('[send_otp] 429 ip-limit ip=' + ip);
        res.setHeader('Retry-After', '3600');
        return res.status(429).json({ error: 'För många förfrågningar — försök igen senare' });
      }

      // Invite-only gate (B2B-pilot): publik registrering är stängd.
      // Vi släpper in om:
      //   a) e-posten har en aktiv pending_invite (ej accepterad, ej utgången), ELLER
      //   b) e-posten är redan en befintlig användare i auth.users.
      const nowIso = new Date().toISOString();
      const inviteRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/pending_invites?email=eq.${encodeURIComponent(normalizedEmail)}&accepted_at=is.null&expires_at=gt.${encodeURIComponent(nowIso)}&select=id&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const hasInvite = Array.isArray(inviteRes.data) && inviteRes.data.length > 0;

      let isExistingUser = false;
      if (!hasInvite) {
        const authLookup = await makeRequest(
          `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(normalizedEmail)}`,
          { method: 'GET', headers: serviceHeaders() }
        );
        const users = Array.isArray(authLookup.data?.users) ? authLookup.data.users
          : (Array.isArray(authLookup.data) ? authLookup.data : []);
        isExistingUser = users.some(u => (u.email || '').toLowerCase() === normalizedEmail);
      }

      if (!hasInvite && !isExistingUser) {
        return res.status(403).json({
          error: 'Du måste vara inbjuden för att skapa konto. Kontakta din handläggare.'
        });
      }

      // shouldCreateUser endast om invite finns; annars är det en ren login.
      const result = await makeRequest(
        `${SUPABASE_URL}/auth/v1/otp`,
        { method: 'POST', headers: baseHeaders },
        { email: normalizedEmail, options: { shouldCreateUser: hasInvite } }
      );
      if (result.status >= 400) return res.status(result.status).json({ error: result.data.error_description || result.data.msg || result.data.message || JSON.stringify(result.data) });
      return res.status(200).json({ success: true });
    }

    if (action === 'verify_otp') {
      // Validera e-post-format
      if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Ogiltig e-postadress' });
      }
      const normalizedEmail = email.toLowerCase().trim();

      // Bruteforce-skydd: max 5 försök per e-post per 15 min
      if (bucketHit(otpVerifyEmailBuckets, normalizedEmail, OTP_VERIFY_WINDOW_MS, OTP_VERIFY_LIMIT)) {
        console.warn('[verify_otp] 429 email-limit ' + maskPII(normalizedEmail));
        res.setHeader('Retry-After', '900');
        return res.status(429).json({ error: 'För många försök — vänta en stund och begär ny kod' });
      }

      const result = await makeRequest(`${SUPABASE_URL}/auth/v1/verify`, { method: 'POST', headers: baseHeaders }, { email: normalizedEmail, token, type: 'email' });
      if (result.status >= 400) return res.status(result.status).json({ error: result.data.error_description || result.data.msg || result.data.message || 'Felaktig eller utgången kod' });

      // Invite-acceptance: efter lyckad OTP, om en pending invite finns för
      // e-posten — markera accepterad och skapa user_assignments-rad med
      // kommun/enhet/role från inbjudan. Best effort: misslyckanden här
      // blockerar inte inloggningen (användaren har giltig session ändå).
      try {
        const verifiedUser = result.data?.user;
        if (verifiedUser?.id) {
          const emailLc = String(email).toLowerCase();
          const nowIso = new Date().toISOString();
          const inviteRes = await makeRequest(
            `${SUPABASE_URL}/rest/v1/pending_invites?email=eq.${encodeURIComponent(emailLc)}&accepted_at=is.null&expires_at=gt.${encodeURIComponent(nowIso)}&select=id,kommun_id,enhet_id,role&limit=1`,
            { method: 'GET', headers: serviceHeaders() }
          );
          const invites = Array.isArray(inviteRes.data) ? inviteRes.data : [];
          if (invites.length) {
            const inv = invites[0];
            await makeRequest(
              `${SUPABASE_URL}/rest/v1/user_assignments`,
              { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } },
              {
                user_id: verifiedUser.id,
                kommun_id: inv.kommun_id || null,
                enhet_id: inv.enhet_id || null,
                role: inv.role,
                status: 'active',
                created_at: nowIso
              }
            );
            await makeRequest(
              `${SUPABASE_URL}/rest/v1/pending_invites?id=eq.${inv.id}`,
              { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
              { accepted_at: nowIso }
            );
          }
        }
      } catch (e) {
        console.error('[verify_otp] invite accept failed:', maskPII(e.message || String(e)));
      }

      return res.status(200).json({ access_token: result.data.access_token, user: result.data.user });
    }

    if (action === 'get_user') {
      const result = await makeRequest(`${SUPABASE_URL}/auth/v1/user`, { method: 'GET', headers: authHeaders(accessToken) });
      return res.status(200).json(result.data);
    }

    if (action === 'save_cv') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      await makeRequest(`${SUPABASE_URL}/rest/v1/cvs`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'resolution=merge-duplicates' } }, { user_id: userId, data: cvData, updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'load_cv') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(200).json({ cv: rows[0]?.data || null });
    }

    if (action === 'save_table') {
      const ALLOWED = ['saved_cvs', 'matched_cvs', 'saved_edu', 'job_diary'];
      if (!ALLOWED.includes(table)) return res.status(400).json({ error: 'Invalid table: ' + table });
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      await makeRequest(`${SUPABASE_URL}/rest/v1/${table}?user_id=eq.${userId}`, { method: 'DELETE', headers: authHeaders(accessToken) });
      await makeRequest(`${SUPABASE_URL}/rest/v1/${table}`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=minimal' } }, { user_id: userId, data: data, saved_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'save_progress') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      await makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'resolution=merge-duplicates' } }, { user_id: userId, progress: data, updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'load_all') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      const [cvRes, savedRes, matchedRes, progressRes, eduRes, diaryRes] = await Promise.all([
        makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/matched_cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=eq.${userId}&select=progress&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_edu?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/job_diary?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
      ]);
      const pick = (r, key) => { const rows = Array.isArray(r.data) ? r.data : []; return rows[0]?.[key] || null; };
      return res.status(200).json({ cv: pick(cvRes, 'data'), savedCvs: pick(savedRes, 'data'), matchedCvs: pick(matchedRes, 'data'), progress: pick(progressRes, 'progress'), savedEdu: pick(eduRes, 'data'), jobDiary: pick(diaryRes, 'data') });
    }

    // ═══════════════════════════════════════════════════════════════
    // LOG_EVENT — aktivitetsloggning
    // Anropas som: { action: 'log_event', accessToken, userId, event_type, metadata }
    // ═══════════════════════════════════════════════════════════════
    if (action === 'log_event') {
      // 1) Validera parametrar
      if (!accessToken || !userId || !event_type) {
        return res.status(400).json({ error: 'accessToken, userId och event_type krävs' });
      }
      if (!ALLOWED_EVENTS.has(event_type)) {
        return res.status(400).json({ error: 'Okänd event_type: ' + event_type });
      }

      // 2) Verifiera att access_token tillhör userId
      const userRes = await makeRequest(`${SUPABASE_URL}/auth/v1/user`, { method: 'GET', headers: authHeaders(accessToken) });
      if (userRes.status >= 400 || !userRes.data || !userRes.data.id) {
        return res.status(401).json({ error: 'Ogiltig access_token' });
      }
      if (userRes.data.id !== userId) {
        return res.status(403).json({ error: 'user_id matchar inte access_token' });
      }

      // 3) Validera metadata-storlek
      let safeMetadata = {};
      if (metadata && typeof metadata === 'object') {
        const json = JSON.stringify(metadata);
        if (json.length > MAX_METADATA_BYTES) {
          return res.status(400).json({ error: 'metadata för stor (max ' + MAX_METADATA_BYTES + ' bytes)' });
        }
        safeMetadata = metadata;
      }

      // 4) Skriv till activity_log (via service-role)
      const userEmail = userRes.data.email || null;
      const insertRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/activity_log`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { user_id: userId, user_email: userEmail, event_type, metadata: safeMetadata }
      );
      if (insertRes.status >= 400) {
        console.error('[log_event] insert failed:', maskPII(insertRes.data));
        return res.status(500).json({ error: 'Loggning misslyckades' });
      }
      return res.status(200).json({ ok: true });
    }

    if (action === 'check_onboarding') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(userId)}&select=name&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rows = Array.isArray(result.data) ? result.data : [];
      const hasName = rows.length > 0 && rows[0].name && rows[0].name.trim() !== '';
      return res.status(200).json({ hasName });
    }

    if (action === 'ensure_participant') {
      if (!isUuid(userId)) return res.status(400).json({ error: 'invalid userId' });
      const auth = await requireUser(res, accessToken, userId); if (!auth.ok) return;
      // FIX: Bara kolumner som faktiskt finns i user_assignments (ingen email/updated_at)
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } },
        { user_id: userId, name: personName || null, phone: personPhone || null, status: 'active', created_at: new Date().toISOString() }
      );
      if (personName) {
        await makeRequest(
          `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${userId}`,
          { method: 'PATCH', headers: serviceHeaders() },
          { name: personName, phone: personPhone || null }
        );
      }
      return res.status(200).json({ ok: true });
    }

    // admin_login: borttagen — endpoint var pre-auth och returnerade hela
    // admin-raden för godtycklig e-post (läckte vilka e-poster som är
    // handläggare + kommun/enhet/roll). Inga klienter använder den.
    // Riktig admin-auth sker via Microsoft OAuth i api/v1/auth/*.

    if (action === 'admin_list_users') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id, requestedEnhetId: filters?.enhet_id
      });
      if (!admin) return;
      // Icke-superadmin låses till sin egen kommun/enhet oavsett klient-filter
      const safeFilters = { ...filters };
      if (admin.role !== 'superadmin') {
        safeFilters.kommun_id = admin.kommun_id;
        if (admin.enhet_id != null) safeFilters.enhet_id = admin.enhet_id;
      }
      // FIX: Sorterar på created_at — updated_at finns ej i user_assignments
      let url = `${SUPABASE_URL}/rest/v1/user_assignments?select=*&order=created_at.desc`;
      if (safeFilters.enhet_id) url += `&enhet_id=eq.${safeFilters.enhet_id}`;
      if (safeFilters.kommun_id) url += `&kommun_id=eq.${safeFilters.kommun_id}`;
      if (safeFilters.status) url += `&status=eq.${safeFilters.status}`;
      if (filters?.limit) url += `&limit=${filters.limit}`;
      if (filters?.offset) url += `&offset=${filters.offset}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      const users = Array.isArray(result.data) ? result.data : [];
      const userIds = users.map(u => u.user_id).filter(Boolean);
      if (userIds.length) {
        const idsFilter = userIds.map(id => `"${id}"`).join(',');
        const [cvRes, progressRes, taskRes] = await Promise.all([
          makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=in.(${idsFilter})&select=user_id,data,updated_at`, { method: 'GET', headers: serviceHeaders() }),
          makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=in.(${idsFilter})&select=user_id,progress`, { method: 'GET', headers: serviceHeaders() }),
          makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=user_id,status`, { method: 'GET', headers: serviceHeaders() }),
        ]);
        const cvMap = {};
        (Array.isArray(cvRes.data) ? cvRes.data : []).forEach(r => { cvMap[r.user_id] = r; });
        const progMap = {};
        (Array.isArray(progressRes.data) ? progressRes.data : []).forEach(r => { progMap[r.user_id] = r.progress; });
        const taskMap = {};
        (Array.isArray(taskRes.data) ? taskRes.data : []).forEach(r => {
          if (!taskMap[r.user_id]) taskMap[r.user_id] = { total: 0, completed: 0, pending: 0 };
          taskMap[r.user_id].total++;
          if (r.status === 'completed') taskMap[r.user_id].completed++;
          if (r.status === 'pending') taskMap[r.user_id].pending++;
        });
        users.forEach(u => {
          u.cv = cvMap[u.user_id] || null;
          u.progress = progMap[u.user_id] || null;
          u.tasks = taskMap[u.user_id] || { total: 0, completed: 0, pending: 0 };
        });
      }
      return res.status(200).json({ data: users });
    }

    if (action === 'admin_get_user') {
      const uid = targetUserId || userId;
      {
        const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
        if (!admin) return;
      }
      const [assignRes, cvRes, progressRes, tasksRes, matchRes] = await Promise.all([
        makeRequest(`${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${uid}&select=*&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${uid}&select=data,updated_at&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=eq.${uid}&select=progress&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=eq.${uid}&select=*&order=created_at.desc`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/matched_cvs?user_id=eq.${uid}&select=data&limit=1`, { method: 'GET', headers: serviceHeaders() }),
      ]);
      const pick = (r, key) => { const rows = Array.isArray(r.data) ? r.data : []; return rows[0]?.[key] || null; };
      return res.status(200).json({
        assignment: (Array.isArray(assignRes.data) ? assignRes.data : [])[0] || null,
        cv: pick(cvRes, 'data'),
        cv_updated: pick(cvRes, 'updated_at'),
        progress: pick(progressRes, 'progress'),
        tasks: Array.isArray(tasksRes.data) ? tasksRes.data : [],
        matchedCvs: pick(matchRes, 'data')
      });
    }

    if (action === 'assign_task') {
      {
        const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: targetUserId });
        if (!admin) return;
      }
      const task = {
        user_id: targetUserId,
        assigned_by: filters?.adminId || null,
        title, description: description || '',
        category: category || 'övrigt',
        type: durationMinutes ? 'timed' : (tParams?.verify_field ? 'auto' : 'manual'),
        verify_field: tParams?.verify_field || null,
        verify_operator: tParams?.verify_operator || '>=',
        verify_target: tParams?.verify_target || null,
        deadline: deadline || null,
        duration_minutes: durationMinutes || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } }, task);
      await makeRequest(`${SUPABASE_URL}/rest/v1/admin_activity_log`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, { user_id: targetUserId, admin_id: filters?.adminId, action: 'task_assigned', detail: title });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ task: rows[0] || null, message: 'Uppgift tilldelad' });
    }

    if (action === 'my_tasks') {
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=eq.${userId}&select=*&order=status.asc,deadline.asc.nullslast`, { method: 'GET', headers: authHeaders(accessToken) });
      return res.status(200).json({ data: Array.isArray(result.data) ? result.data : [] });
    }

    if (action === 'start_task_session') {
      await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}&user_id=eq.${userId}`, { method: 'PATCH', headers: authHeaders(accessToken) }, { status: 'active', started_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/task_sessions`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=representation' } }, { task_id: parseInt(taskId), user_id: userId, started_at: new Date().toISOString() });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ session: rows[0] || null });
    }

    if (action === 'stop_task_session') {
      const sessRes = await makeRequest(`${SUPABASE_URL}/rest/v1/task_sessions?task_id=eq.${taskId}&user_id=eq.${userId}&ended_at=is.null&order=started_at.desc&limit=1`, { method: 'GET', headers: authHeaders(accessToken) });
      const sessions = Array.isArray(sessRes.data) ? sessRes.data : [];
      if (!sessions.length) return res.status(400).json({ error: 'Ingen aktiv session' });
      const session = sessions[0];
      const durationSec = Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000);
      await makeRequest(`${SUPABASE_URL}/rest/v1/task_sessions?id=eq.${session.id}`, { method: 'PATCH', headers: authHeaders(accessToken) }, { ended_at: new Date().toISOString(), duration_sec: durationSec });
      const totalRes = await makeRequest(`${SUPABASE_URL}/rest/v1/task_sessions?task_id=eq.${taskId}&select=duration_sec`, { method: 'GET', headers: authHeaders(accessToken) });
      const totalSec = (Array.isArray(totalRes.data) ? totalRes.data : []).reduce((sum, s) => sum + (s.duration_sec || 0), 0);
      const taskRes = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}&limit=1`, { method: 'GET', headers: authHeaders(accessToken) });
      const task = (Array.isArray(taskRes.data) ? taskRes.data : [])[0];
      let completed = false;
      if (task?.verify_field === 'session_duration' && task?.verify_target) completed = totalSec >= parseInt(task.verify_target);
      const updates = { time_spent_sec: totalSec, updated_at: new Date().toISOString() };
      if (completed) { updates.status = 'completed'; updates.completed_at = new Date().toISOString(); }
      await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`, { method: 'PATCH', headers: authHeaders(accessToken) }, updates);
      return res.status(200).json({ duration_sec: durationSec, total_sec: totalSec, completed });
    }

    if (action === 'complete_task') {
      await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}&user_id=eq.${userId}`, { method: 'PATCH', headers: authHeaders(accessToken) }, { status: 'completed', completed_at: new Date().toISOString(), result_note: note || null, updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'cancel_task') {
      const taskLookup = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}&select=user_id&limit=1`, { method: 'GET', headers: serviceHeaders() });
      const taskRows = Array.isArray(taskLookup.data) ? taskLookup.data : [];
      if (!taskRows.length) return res.status(404).json({ error: 'task_not_found' });
      {
        const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: taskRows[0].user_id });
        if (!admin) return;
      }
      await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`, { method: 'PATCH', headers: serviceHeaders() }, { status: 'cancelled', updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'admin_invite') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: kommunId, requestedEnhetId: enhetId
      });
      if (!admin) return;
      // Icke-superadmin: tvinga egen kommun/enhet + förbjud superadmin-roll
      let inviteKommunId = kommunId, inviteEnhetId = enhetId, inviteRole = role || 'handlaggare';
      if (admin.role !== 'superadmin') {
        inviteKommunId = admin.kommun_id;
        if (admin.enhet_id != null) inviteEnhetId = admin.enhet_id;
        if (inviteRole === 'superadmin') return res.status(403).json({ error: 'forbidden_role' });
      }
      const existing = await makeRequest(`${SUPABASE_URL}/rest/v1/admins?email=eq.${encodeURIComponent(email)}&limit=1`, { method: 'GET', headers: serviceHeaders() });
      if (Array.isArray(existing.data) && existing.data.length) return res.status(409).json({ error: 'E-postadressen finns redan' });
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/admins`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } }, { name: personName || email.split('@')[0], email: email.toLowerCase(), role: inviteRole, kommun_id: inviteKommunId || null, enhet_id: inviteEnhetId || null, invite_token: inviteToken, invite_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ admin: rows[0] || null, invite_token: inviteToken });
    }

    if (action === 'admin_list_admins') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id
      });
      if (!admin) return;
      let url = `${SUPABASE_URL}/rest/v1/admins?select=*,kommuner(name),enheter(name)&order=role.asc,name.asc`;
      const scopeKommunId = admin.role === 'superadmin' ? filters?.kommun_id : admin.kommun_id;
      if (scopeKommunId) url += `&kommun_id=eq.${scopeKommunId}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      return res.status(200).json({ data: Array.isArray(result.data) ? result.data : [] });
    }

    if (action === 'admin_stats') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id, requestedEnhetId: filters?.enhet_id
      });
      if (!admin) return;
      const isSuper = admin.role === 'superadmin';
      const scopeKommunId = isSuper ? filters?.kommun_id : admin.kommun_id;
      const scopeEnhetId = isSuper ? filters?.enhet_id
        : (admin.enhet_id != null ? admin.enhet_id : filters?.enhet_id);
      let userUrl = `${SUPABASE_URL}/rest/v1/user_assignments?select=status,kommun_id,enhet_id,user_id`;
      if (scopeKommunId) userUrl += `&kommun_id=eq.${scopeKommunId}`;
      if (scopeEnhetId)  userUrl += `&enhet_id=eq.${scopeEnhetId}`;
      const userRes = await makeRequest(userUrl, { method: 'GET', headers: serviceHeaders() });
      const users = Array.isArray(userRes.data) ? userRes.data : [];
      // Task-statistik scopas till denna kommuns deltagare. Superadmin utan
      // kommun-filter får aggregat över hela plattformen (oförändrat beteende).
      let tasks = [];
      if (isSuper && !scopeKommunId) {
        const taskRes = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?select=status,category,time_spent_sec,user_id`, { method: 'GET', headers: serviceHeaders() });
        tasks = Array.isArray(taskRes.data) ? taskRes.data : [];
      } else {
        const statUserIds = users.map(u => u.user_id).filter(Boolean);
        if (statUserIds.length) {
          const idsFilter = statUserIds.map(id => `"${id}"`).join(',');
          const taskRes = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=status,category,time_spent_sec,user_id`, { method: 'GET', headers: serviceHeaders() });
          tasks = Array.isArray(taskRes.data) ? taskRes.data : [];
        }
      }
      return res.status(200).json({
        users: { total: users.length, active: users.filter(u => u.status === 'active').length, recent: users.filter(u => u.status === 'recent').length, new_count: users.filter(u => u.status === 'new').length, inactive: users.filter(u => u.status === 'inactive').length },
        tasks: { total: tasks.length, completed: tasks.filter(t => t.status === 'completed').length, pending: tasks.filter(t => t.status === 'pending').length, active: tasks.filter(t => t.status === 'active').length, expired: tasks.filter(t => t.status === 'expired').length, total_time_sec: tasks.reduce((s, t) => s + (t.time_spent_sec || 0), 0) },
        byCategory: Object.entries(tasks.reduce((acc, t) => { if (!acc[t.category]) acc[t.category] = { total: 0, completed: 0 }; acc[t.category].total++; if (t.status === 'completed') acc[t.category].completed++; return acc; }, {})).map(([cat, data]) => ({ category: cat, ...data })),
      });
    }

    if (action === 'admin_get_enheter') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id
      });
      if (!admin) return;
      let url = `${SUPABASE_URL}/rest/v1/enheter?select=*,kommuner(name)&order=name`;
      const scopeKommunId = admin.role === 'superadmin' ? filters?.kommun_id : admin.kommun_id;
      if (scopeKommunId) url += `&kommun_id=eq.${scopeKommunId}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      return res.status(200).json({ data: Array.isArray(result.data) ? result.data : [] });
    }

    // ═══════════════════════════════════════════════════════════════
    // INTERVJUTRÄNING — Actions för AI-intervju-modulen
    // ═══════════════════════════════════════════════════════════════

    if (action === 'create_interview_session') {
      // Skapa ny intervjusession
      // Förväntar: accessToken, userId, branch, company?, roleTitle?, difficulty?, jobMatchId?
      const { branch, company, roleTitle, difficulty, jobMatchId } = req.body || {};
      if (!branch) return res.status(400).json({ error: 'branch krävs' });
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_sessions`,
        { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=representation' } },
        {
          user_id: userId,
          branch: branch,
          company: company || null,
          role_title: roleTitle || null,
          difficulty: difficulty || 'medium',
          job_match_id: jobMatchId || null
        }
      );
      if (result.status >= 400) return res.status(result.status).json({ error: result.data.message || 'Kunde inte skapa session' });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ session: rows[0] || null });
    }

    if (action === 'add_interview_message') {
      // Lägg till meddelande i intervju
      // Förväntar: accessToken, sessionId, role ('interviewer'|'candidate'), content
      const { sessionId, role: msgRole, content } = req.body || {};
      if (!sessionId || !msgRole || !content) return res.status(400).json({ error: 'sessionId, role, content krävs' });
      if (msgRole !== 'interviewer' && msgRole !== 'candidate') return res.status(400).json({ error: 'role måste vara interviewer eller candidate' });
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_messages`,
        { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=representation' } },
        {
          session_id: sessionId,
          role: msgRole,
          content: content
        }
      );
      if (result.status >= 400) return res.status(result.status).json({ error: result.data.message || 'Kunde inte spara meddelande' });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ message: rows[0] || null });
    }

    if (action === 'complete_interview_session') {
      // Avsluta session och spara feedback
      // Förväntar: accessToken, sessionId, durationSeconds?, overallFeedback?, userRating?, userNotes?, status?
      const { sessionId, durationSeconds, overallFeedback, userRating, userNotes, status: sessStatus } = req.body || {};
      if (!sessionId) return res.status(400).json({ error: 'sessionId krävs' });
      const updates = {
        status: sessStatus || 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds || null,
        overall_feedback: overallFeedback || null,
        user_rating: userRating || null,
        user_notes: userNotes || null
      };
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_sessions?id=eq.${sessionId}&user_id=eq.${userId}`,
        { method: 'PATCH', headers: { ...authHeaders(accessToken), 'Prefer': 'return=minimal' } },
        updates
      );
      return res.status(200).json({ success: true });
    }

    if (action === 'save_interview_question') {
      // Spara en fråga att öva vidare på
      // Förväntar: accessToken, userId, sessionId?, messageId?, questionText, userAnswer?, difficulty?, category?
      const { sessionId, messageId, questionText, userAnswer, difficulty: qDiff, category: qCat } = req.body || {};
      if (!questionText) return res.status(400).json({ error: 'questionText krävs' });
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/saved_questions`,
        { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=representation' } },
        {
          user_id: userId,
          session_id: sessionId || null,
          message_id: messageId || null,
          question_text: questionText,
          user_answer: userAnswer || null,
          category: qCat || null,
          difficulty: qDiff || null
        }
      );
      if (result.status >= 400) return res.status(result.status).json({ error: result.data.message || 'Kunde inte spara fråga' });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ savedQuestion: rows[0] || null });
    }

    if (action === 'list_interview_sessions') {
      // Hämta intervjuhistorik för användaren
      // Förväntar: accessToken, userId, limit?
      const listLimit = (req.body && req.body.limit) || 20;
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_sessions?user_id=eq.${userId}&select=*&order=started_at.desc&limit=${listLimit}`,
        { method: 'GET', headers: authHeaders(accessToken) }
      );
      return res.status(200).json({ sessions: Array.isArray(result.data) ? result.data : [] });
    }

    // ═══════════════════════════════════════════════════════════════
    // INVITE-SYSTEM — admin_invite_user / admin_list_invites / admin_revoke_invite
    // Stänger publik registrering. send_otp ovan kontrollerar att e-posten har
    // en aktiv rad i pending_invites (eller är befintlig användare).
    // ═══════════════════════════════════════════════════════════════

    if (action === 'admin_invite_user') {
      if (!isEmail(email)) return res.status(400).json({ error: 'Ogiltig e-postadress' });
      const reqRole = role || 'invanare';
      if (!INVITE_ALLOWED_ROLES.has(reqRole)) {
        return res.status(400).json({ error: 'Ogiltig roll' });
      }
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: kommunId, requestedEnhetId: enhetId
      });
      if (!admin) return;

      // Behörighetsmatris för att skapa invite:
      //   superadmin       — får bjuda in vem som helst, vilken roll som helst
      //   admin            — får bjuda in handlaggare/invanare till sin kommun
      //   handlaggare      — får BARA bjuda in invanare till sin enhet
      //   invanare         — får inte bjuda in alls (ingen admin-token = blockerad redan)
      let inviteKommunId = kommunId, inviteEnhetId = enhetId, inviteRole = reqRole;
      if (admin.role === 'superadmin') {
        // ingen tvångsmappning
      } else if (admin.role === 'admin') {
        inviteKommunId = admin.kommun_id;
        if (admin.enhet_id != null) inviteEnhetId = admin.enhet_id;
        if (inviteRole === 'admin' && admin.enhet_id != null) {
          // enhet-admin kan inte skapa kommun-admin
          await logAdminDenied(admin.id, action, 'forbidden_role_admin_from_enhet');
          return res.status(403).json({ error: 'forbidden_role' });
        }
      } else if (admin.role === 'handlaggare') {
        if (inviteRole !== 'invanare') {
          await logAdminDenied(admin.id, action, 'handlaggare_can_only_invite_invanare');
          return res.status(403).json({ error: 'forbidden_role' });
        }
        inviteKommunId = admin.kommun_id;
        inviteEnhetId = admin.enhet_id || enhetId || null;
        if (!inviteEnhetId) {
          return res.status(400).json({ error: 'enhetId krävs' });
        }
      } else {
        await logAdminDenied(admin.id, action, 'role_cannot_invite');
        return res.status(403).json({ error: 'forbidden_role' });
      }

      const emailLc = email.toLowerCase();
      // Konflikt: redan en aktiv invite för e-posten?
      const existing = await makeRequest(
        `${SUPABASE_URL}/rest/v1/pending_invites?email=eq.${encodeURIComponent(emailLc)}&accepted_at=is.null&select=id&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      if (Array.isArray(existing.data) && existing.data.length) {
        return res.status(409).json({ error: 'En aktiv inbjudan finns redan för denna e-post' });
      }

      const inviteTok = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const insertRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/pending_invites`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } },
        {
          email: emailLc,
          kommun_id: inviteKommunId || null,
          enhet_id: inviteEnhetId || null,
          invited_by_admin_id: admin.id,
          role: inviteRole,
          token: inviteTok,
          expires_at: expiresAt
        }
      );
      if (insertRes.status >= 400) {
        console.error('[admin_invite_user] insert failed:', maskPII(insertRes.data));
        return res.status(500).json({ error: 'Kunde inte skapa inbjudan' });
      }
      const rows = Array.isArray(insertRes.data) ? insertRes.data : [];
      const created = rows[0] || null;
      await logAdminAction(admin.id, 'invite_created', `role=${inviteRole} kommun=${inviteKommunId || '-'} enhet=${inviteEnhetId || '-'}`);
      // Returnera inte token (skickas separat via mejl-flöde när det är på plats).
      return res.status(201).json({
        invite: created ? {
          id: created.id,
          email: created.email,
          role: created.role,
          kommun_id: created.kommun_id,
          enhet_id: created.enhet_id,
          expires_at: created.expires_at,
          created_at: created.created_at
        } : null
      });
    }

    if (action === 'admin_list_invites') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id, requestedEnhetId: filters?.enhet_id
      });
      if (!admin) return;
      const isSuper = admin.role === 'superadmin';
      let url = `${SUPABASE_URL}/rest/v1/pending_invites?select=id,email,role,kommun_id,enhet_id,invited_by_admin_id,expires_at,accepted_at,created_at&order=created_at.desc`;
      // Tenant-scope: non-super låses till sin kommun (+ enhet om enhet-bunden)
      if (!isSuper) {
        url += `&kommun_id=eq.${admin.kommun_id}`;
        if (admin.enhet_id != null) url += `&enhet_id=eq.${admin.enhet_id}`;
      } else {
        if (filters?.kommun_id) url += `&kommun_id=eq.${filters.kommun_id}`;
        if (filters?.enhet_id)  url += `&enhet_id=eq.${filters.enhet_id}`;
      }
      // Default: visa bara pending (icke-accepterade, icke-utgångna)
      if (filters?.includeAccepted !== true) url += `&accepted_at=is.null`;
      if (filters?.limit)  url += `&limit=${parseInt(filters.limit) || 100}`;
      if (filters?.offset) url += `&offset=${parseInt(filters.offset) || 0}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      return res.status(200).json({ data: Array.isArray(result.data) ? result.data : [] });
    }

    if (action === 'admin_revoke_invite') {
      if (!isUuidStrict(inviteId)) return res.status(400).json({ error: 'invalid inviteId' });
      // Hämta invitens scope först så vi kan tenant-kolla.
      const lookup = await makeRequest(
        `${SUPABASE_URL}/rest/v1/pending_invites?id=eq.${inviteId}&select=id,email,kommun_id,enhet_id,accepted_at&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rows = Array.isArray(lookup.data) ? lookup.data : [];
      if (!rows.length) return res.status(404).json({ error: 'invite_not_found' });
      const inv = rows[0];
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: inv.kommun_id, requestedEnhetId: inv.enhet_id
      });
      if (!admin) return;
      if (inv.accepted_at) {
        return res.status(409).json({ error: 'Inbjudan är redan använd eller återkallad' });
      }
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/pending_invites?id=eq.${inviteId}`,
        { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { accepted_at: new Date().toISOString(), token: 'revoked' }
      );
      await logAdminAction(admin.id, 'invite_revoked', `invite=${inviteId}`);
      return res.status(200).json({ success: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // SEED_SUPERADMIN — bootstrapping (env-skyddat)
    // Skapar första superadmin när systemet rullas ut. Idempotent: gör
    // ingenting om SUPERADMIN_EMAIL redan finns som admin. Kräver både
    // env-match på SUPERADMIN_EMAIL och delad hemlighet SEED_TOKEN i body.
    // ═══════════════════════════════════════════════════════════════
    if (action === 'seed_superadmin') {
      const envEmail = (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim();
      const envSeedTok = process.env.SEED_TOKEN || '';
      if (!envEmail || !envSeedTok) {
        return res.status(503).json({ error: 'seed_not_configured' });
      }
      if (!isEmail(email) || email.toLowerCase().trim() !== envEmail) {
        return res.status(403).json({ error: 'forbidden' });
      }
      if (!seedToken || typeof seedToken !== 'string' ||
          seedToken.length !== envSeedTok.length ||
          !crypto.timingSafeEqual(Buffer.from(seedToken), Buffer.from(envSeedTok))) {
        return res.status(403).json({ error: 'forbidden' });
      }
      // Finns redan en admin för e-posten? Idempotent no-op.
      const existing = await makeRequest(
        `${SUPABASE_URL}/rest/v1/admins?email=eq.${encodeURIComponent(envEmail)}&select=id,role&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      if (Array.isArray(existing.data) && existing.data.length) {
        return res.status(200).json({ ok: true, message: 'redan seedad', admin: existing.data[0] });
      }
      const insertRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/admins`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } },
        {
          name: envEmail.split('@')[0],
          email: envEmail,
          role: 'superadmin',
          kommun_id: null,
          enhet_id: null
        }
      );
      if (insertRes.status >= 400) {
        console.error('[seed_superadmin] insert failed:', maskPII(insertRes.data));
        return res.status(500).json({ error: 'Kunde inte skapa superadmin' });
      }
      const rows = Array.isArray(insertRes.data) ? insertRes.data : [];
      const created = rows[0] || null;
      await logAdminAction(created?.id || null, 'seed_superadmin', `email=${envEmail}`);
      return res.status(201).json({ ok: true, admin: created });
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });

  } catch (err) {
    Sentry.captureException(err);
    console.error('Supabase API error:', maskPII(err.message));
    return res.status(500).json({ error: 'Ett serverfel inträffade' });
  }
}
