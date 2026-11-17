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

// Enkel in-memory rate-limit per IP+action. Lever per Lambda-instans, så
// inte vattentätt — men höjer kostnaden för brute-force avsevärt. Auth +
// invite-endpoints är prioriterade.
const _rateBuckets = new Map();
function checkRateLimit(ip, action, maxPerMin) {
  const key = `${ip}::${action}`;
  const now = Date.now();
  const arr = (_rateBuckets.get(key) || []).filter(t => now - t < 60000);
  if (arr.length >= maxPerMin) return false;
  arr.push(now);
  _rateBuckets.set(key, arr);
  // GC
  if (_rateBuckets.size > 5000) {
    for (const [k, v] of _rateBuckets) {
      if (!v.length || now - v[v.length - 1] > 60000) _rateBuckets.delete(k);
    }
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate-limit för känsliga actions (auth / invites / login / radering)
  const _ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim() || 'unknown';
  const _action = req.body?.action;
  const _RATE_LIMITS = {
    admin_login: 20, admin_invite: 20, user_invite: 30, admin_resend_invite: 20,
    admin_delete_user: 10, user_delete_self: 5, send_otp: 10, verify_otp: 20,
    admin_update_program: 60, admin_save_narvaro: 120, admin_edit_schema: 60,
    admin_create_serie: 60, admin_avsluta_schema: 30, admin_installa_pass: 60,
    admin_save_vecka_tema: 60, admin_save_temacykel_start: 30
  };
  if (_action && _RATE_LIMITS[_action] && !checkRateLimit(_ip, _action, _RATE_LIMITS[_action])) {
    return res.status(429).json({ error: 'För många försök — vänta en minut och försök igen.' });
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
    aiConsent, aiConsentVersion
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

  // Sanering av UUID-arrays innan de stoppas in i PostgREST `in.(...)`-filter.
  // Skyddar mot SQL/PostgREST-injection om en bus-rad innehåller t.ex. `"`.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  function safeUuidIn(arr) {
    return (arr || [])
      .filter(id => typeof id === 'string' && UUID_RE.test(id))
      .map(id => `"${id}"`).join(',');
  }

  // verifierar accessToken mot Supabase och returnerar { id, email } eller null.
  // Används för att stoppa attacker där `userId` skickas i body — vi använder
  // ALLTID id:t från JWT istället så användare endast kan skriva sin egen data.
  async function verifyJwtUser(accessToken) {
    if (!accessToken) return null;
    try {
      const r = await makeRequest(`${SUPABASE_URL}/auth/v1/user`, { method: 'GET', headers: authHeaders(accessToken) });
      if (r.status >= 400 || !r.data?.id) return null;
      return { id: r.data.id, email: (r.data.email || '').toLowerCase() };
    } catch(_) { return null; }
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

  // Loggar lyckad admin-åtgärd till admin_audit (forensik + compliance).
  // Blockerar aldrig svaret. Detaljer maskeras inte här — använd endast
  // ID-värden eller redan maskerad data i `details`.
  async function logAdminAction(adminId, action, details) {
    try {
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/admin_audit`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { admin_id: adminId || null, action, details: details || null }
      );
    } catch (e) { /* loggning får aldrig blockera */ }
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

  try {

    if (action === 'send_otp') {
      const result = await makeRequest(`${SUPABASE_URL}/auth/v1/otp`, { method: 'POST', headers: baseHeaders }, { email, options: { shouldCreateUser: true } });
      if (result.status >= 400) {
        // Läck aldrig rå DB-payload till klienten — logga maskat serverside.
        console.warn('[send_otp] misslyckades:', result.status, maskPII(result.data));
        return res.status(result.status).json({ error: result.data.error_description || result.data.msg || result.data.message || 'Kunde inte skicka koden — försök igen om en stund' });
      }
      return res.status(200).json({ success: true });
    }

    if (action === 'verify_otp') {
      // Supabase lagrar engångskoden under olika token_type beroende på hur
      // den skickades och om kontot redan fanns: en NY användare får
      // 'confirmation_token' (type 'email'), medan en BEFINTLIG användare som
      // begär inloggningskod får 'recovery_token'. Skickar vi fel type svarar
      // Supabase "Token has expired or is invalid" även när koden är helt
      // korrekt och oanvänd — vilket ser ut som ett utgånget mejl för
      // deltagaren men i själva verket är ett typfel.
      //
      // Vi provar därför typerna i tur och ordning. Koden förbrukas först vid
      // en lyckad verifiering, så ett misslyckat försök bränner ingenting.
      const TYPER = ['email', 'recovery', 'magiclink'];
      let sista = null;
      for (const type of TYPER) {
        const r = await makeRequest(
          `${SUPABASE_URL}/auth/v1/verify`,
          { method: 'POST', headers: baseHeaders },
          { email, token, type }
        );
        if (r.status < 400) {
          return res.status(200).json({
            access_token: r.data.access_token,
            refresh_token: r.data.refresh_token,
            user: r.data.user
          });
        }
        sista = r;
        // 429 = rate limit. Fortsätt inte hamra då.
        if (r.status === 429) break;
      }
      console.warn('[verify_otp] misslyckades för alla typer:', sista && sista.status, maskPII(sista && sista.data));
      return res.status(sista ? sista.status : 400).json({
        error: (sista && (sista.data.error_description || sista.data.msg || sista.data.message))
          || 'Felaktig eller utgången kod'
      });
    }

    if (action === 'refresh_session') {
      // Förnyar deltagarens Supabase-session (access-JWT ~1h) med refresh-token
      // så att appen inte tyst loggar ut mitt i ett pass.
      const rt = req.body?.refreshToken;
      if (!rt || typeof rt !== 'string') return res.status(400).json({ error: 'refreshToken krävs' });
      const result = await makeRequest(
        `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
        { method: 'POST', headers: baseHeaders },
        { refresh_token: rt }
      );
      if (result.status >= 400) {
        // Refresh-tokens roteras — en förbrukad/återkallad token kräver ny inloggning.
        return res.status(401).json({ error: 'refresh_failed' });
      }
      return res.status(200).json({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        user: result.data.user
      });
    }

    if (action === 'get_user') {
      const result = await makeRequest(`${SUPABASE_URL}/auth/v1/user`, { method: 'GET', headers: authHeaders(accessToken) });
      return res.status(200).json(result.data);
    }

    if (action === 'save_cv') {
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      await makeRequest(`${SUPABASE_URL}/rest/v1/cvs`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'resolution=merge-duplicates' } }, { user_id: jwt.id, data: cvData, updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'load_cv') {
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${jwt.id}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) });
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(200).json({ cv: rows[0]?.data || null });
    }

    if (action === 'save_table') {
      const ALLOWED = ['saved_cvs', 'matched_cvs', 'saved_edu', 'job_diary', 'sprak_progress'];
      if (!ALLOWED.includes(table)) return res.status(400).json({ error: 'Invalid table: ' + table });
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      await makeRequest(`${SUPABASE_URL}/rest/v1/${table}?user_id=eq.${jwt.id}`, { method: 'DELETE', headers: authHeaders(accessToken) });
      await makeRequest(`${SUPABASE_URL}/rest/v1/${table}`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'return=minimal' } }, { user_id: jwt.id, data: data, saved_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'save_progress') {
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      await makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress`, { method: 'POST', headers: { ...authHeaders(accessToken), 'Prefer': 'resolution=merge-duplicates' } }, { user_id: jwt.id, progress: data, updated_at: new Date().toISOString() });
      return res.status(200).json({ success: true });
    }

    if (action === 'load_all') {
      const [cvRes, savedRes, matchedRes, progressRes, eduRes, diaryRes, sprakRes] = await Promise.all([
        makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/matched_cvs?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=eq.${userId}&select=progress&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_edu?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/job_diary?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
        makeRequest(`${SUPABASE_URL}/rest/v1/sprak_progress?user_id=eq.${userId}&select=data&limit=1`, { method: 'GET', headers: authHeaders(accessToken) }),
      ]);
      const pick = (r, key) => { const rows = Array.isArray(r.data) ? r.data : []; return rows[0]?.[key] || null; };
      return res.status(200).json({ cv: pick(cvRes, 'data'), savedCvs: pick(savedRes, 'data'), matchedCvs: pick(matchedRes, 'data'), progress: pick(progressRes, 'progress'), savedEdu: pick(eduRes, 'data'), jobDiary: pick(diaryRes, 'data'), sprakProgress: pick(sprakRes, 'data') });
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
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${jwt.id}&select=name&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rows = Array.isArray(result.data) ? result.data : [];
      const hasName = rows.length > 0 && rows[0].name && rows[0].name.trim() !== '';
      return res.status(200).json({ hasName });
    }

    if (action === 'ensure_participant') {
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      // FIX: Bara kolumner som faktiskt finns i user_assignments (ingen email/updated_at)
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } },
        { user_id: jwt.id, name: personName || null, phone: personPhone || null, status: 'active', created_at: new Date().toISOString() }
      );
      if (personName) {
        await makeRequest(
          `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${jwt.id}`,
          { method: 'PATCH', headers: serviceHeaders() },
          { name: personName, phone: personPhone || null }
        );
      }
      return res.status(200).json({ ok: true });
    }

    if (action === 'save_ai_consent') {
      // Sparar/återkallar deltagarens AI-samtycke. Idempotent — kör
      // ensure_participant först om raden saknas så vi inte tappar samtycket.
      // Konsumerar ev. user_invite (inviteToken) och kopplar kommun/enhet.
      // Saknas invite: faller tillbaka på "Övrigt"-kommunen.
      const _jwt = await verifyJwtUser(accessToken);
      if (!_jwt) return res.status(401).json({ error: 'invalid_token' });
      const _uid = _jwt.id;  // använd ALLTID id från JWT, inte body
      const version = (aiConsentVersion && String(aiConsentVersion).slice(0, 32)) || '2026-06-07';
      const now = new Date().toISOString();
      const patch = aiConsent === false
        ? { ai_consent_withdrawn_at: now }
        : { ai_consent_at: now, ai_consent_version: version, ai_consent_withdrawn_at: null };

      // Slå upp ev. invite för att kunna tilldela kommun/enhet vid första-gångs-skapande.
      // email kommer från verifierat JWT (_jwt.email) — aldrig från body.
      let inviteKommunId = null, inviteEnhetId = null, inviteIdToConsume = null;
      const verifiedEmail = _jwt.email;
      const inviteToken = req.body?.inviteToken;
      if (inviteToken && verifiedEmail) {
        const inv = await makeRequest(
          `${SUPABASE_URL}/rest/v1/user_invites?token=eq.${encodeURIComponent(inviteToken)}&email=eq.${encodeURIComponent(verifiedEmail)}&consumed_at=is.null&select=id,kommun_id,enhet_id,expires_at&limit=1`,
          { method: 'GET', headers: serviceHeaders() }
        );
        const inviteRow = Array.isArray(inv.data) && inv.data[0];
        if (inviteRow && new Date(inviteRow.expires_at) > new Date()) {
          inviteKommunId = inviteRow.kommun_id;
          inviteEnhetId  = inviteRow.enhet_id;
          inviteIdToConsume = inviteRow.id;
        }
      }
      // Fallback till "Övrigt" om ingen invite matchade
      if (!inviteKommunId) {
        const ovrigt = await makeRequest(
          `${SUPABASE_URL}/rest/v1/kommuner?name=eq.${encodeURIComponent('Övrigt')}&select=id,enheter(id,name)&limit=1`,
          { method: 'GET', headers: serviceHeaders() }
        );
        const orow = Array.isArray(ovrigt.data) && ovrigt.data[0];
        if (orow) {
          inviteKommunId = orow.id;
          const defEnhet = (orow.enheter || []).find(e => e.name === 'Allmänna användare');
          inviteEnhetId  = defEnhet ? defEnhet.id : null;
        }
      }

      // Säkerställ att raden finns (UPSERT — sätter kommun/enhet endast vid nyskapande)
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } },
        { user_id: _uid, status: 'active', created_at: now, kommun_id: inviteKommunId, enhet_id: inviteEnhetId }
      );
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${_uid}`,
        { method: 'PATCH', headers: serviceHeaders() },
        patch
      );
      if (result.status >= 400) {
        console.warn('[save_ai_consent] DB-patch misslyckades:', result.status, maskPII(result.data));
        return res.status(200).json({ ok: true, persisted: false });
      }
      // Konsumera invite efter lyckad patch
      if (inviteIdToConsume) {
        await makeRequest(
          `${SUPABASE_URL}/rest/v1/user_invites?id=eq.${inviteIdToConsume}`,
          { method: 'PATCH', headers: serviceHeaders() },
          { consumed_at: now, consumed_user_id: _uid }
        );
      }
      return res.status(200).json({ ok: true, persisted: true, at: now, version });
    }

    if (action === 'admin_login') {
      // BORTTAGEN (säkerhet): denna action returnerade hela admins-raden inkl.
      // `invite_token` (en credential) HELT OAUTENTISERAT via service-role, och
      // möjliggjorde e-postuppräkning av handläggare/admins samt en oautentiserad
      // last_login-skrivning. Den anropas inte längre av frontend — admin-inloggning
      // sker via Microsoft OAuth (api/v1/auth/microsoft*). Returnerar 410 så en ev.
      // gammal cachead klient failar rent istället för att läcka data.
      return res.status(410).json({ error: 'admin_login är borttagen — använd Microsoft-inloggning' });
    }

    if (action === 'admin_list_tasks') {
      // Lista ALLA tilldelade uppgifter inom handläggarens scope, med
      // deltagarnamn och deadline. Superadmin ser alla; övriga sin kommun/enhet.
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id, requestedEnhetId: filters?.enhet_id
      });
      if (!admin) return;
      // 1) Hitta deltagar-IDs inom scope
      let uaUrl = `${SUPABASE_URL}/rest/v1/user_assignments?select=user_id,name,kommun_id,enhet_id`;
      if (admin.role !== 'superadmin') {
        uaUrl += `&kommun_id=eq.${admin.kommun_id}`;
        if (admin.enhet_id != null) uaUrl += `&enhet_id=eq.${admin.enhet_id}`;
      }
      const uaRes = await makeRequest(uaUrl, { method: 'GET', headers: serviceHeaders() });
      const uas = Array.isArray(uaRes.data) ? uaRes.data : [];
      const nameByUser = {};
      uas.forEach(u => { nameByUser[u.user_id] = u.name || null; });
      const scopeIds = uas.map(u => u.user_id).filter(Boolean);
      if (!scopeIds.length) return res.status(200).json({ data: [] });
      const idsFilter = safeUuidIn(scopeIds);
      if (!idsFilter) return res.status(200).json({ data: [] });
      // 2) Hämta alla tasks för dessa deltagare
      const tRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=id,user_id,title,category,status,deadline,created_at,completed_at,assigned_by&order=created_at.desc`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const tasks = (Array.isArray(tRes.data) ? tRes.data : []).map(t => ({
        ...t, participant_name: nameByUser[t.user_id] || null
      }));
      return res.status(200).json({ data: tasks });
    }

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
      if (safeFilters.status) url += `&status=eq.${encodeURIComponent(safeFilters.status)}`;
      const _lim = parseInt(filters?.limit, 10); if (Number.isFinite(_lim) && _lim > 0) url += `&limit=${_lim}`;
      const _off = parseInt(filters?.offset, 10); if (Number.isFinite(_off) && _off >= 0) url += `&offset=${_off}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      const users = Array.isArray(result.data) ? result.data : [];
      const userIds = users.map(u => u.user_id).filter(Boolean);
      if (userIds.length) {
        const idsFilter = safeUuidIn(userIds);
        if (!idsFilter) return res.status(200).json({ data: [] });
        const [cvRes, progressRes, taskRes, sprakRes] = await Promise.all([
          makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=in.(${idsFilter})&select=user_id,data,updated_at`, { method: 'GET', headers: serviceHeaders() }),
          makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=in.(${idsFilter})&select=user_id,progress`, { method: 'GET', headers: serviceHeaders() }),
          makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=user_id,status`, { method: 'GET', headers: serviceHeaders() }),
          makeRequest(`${SUPABASE_URL}/rest/v1/sprak_progress?user_id=in.(${idsFilter})&select=user_id,data`, { method: 'GET', headers: serviceHeaders() }),
        ]);
        const cvMap = {};
        (Array.isArray(cvRes.data) ? cvRes.data : []).forEach(r => { cvMap[r.user_id] = r; });
        const progMap = {};
        (Array.isArray(progressRes.data) ? progressRes.data : []).forEach(r => { progMap[r.user_id] = r.progress; });
        // Språkträning → { pass, ratt, totalt } per deltagare
        const sprakMap = {};
        (Array.isArray(sprakRes.data) ? sprakRes.data : []).forEach(r => {
          const d = r.data || {};
          let pass = 0, ratt = 0, totalt = 0, tidSek = 0;
          Object.keys(d).forEach(bransch => {
            if (bransch.charAt(0) === '_') return;          // _uppdaterad m.fl.
            const b = d[bransch] || {};
            Object.keys(b).forEach(mode => {
              pass += b[mode].pass || 0;
              ratt += b[mode].ratt || 0;
              totalt += b[mode].totalt || 0;
              tidSek += b[mode].tidSek || 0;
            });
          });
          // Senaste språktest + förändring mot förra. Jämförs bara inom
          // samma testversion — ändras frågebanken är poängen inte jämförbar.
          const tester = Array.isArray(d._test) ? d._test : [];
          tester.forEach(t => { tidSek += t.tidSek || 0; });
          const sista = tester[tester.length - 1] || null;
          const forra = tester[tester.length - 2] || null;
          const test = sista ? {
            steg: sista.steg,
            poang: sista.poang,
            datum: sista.datum,
            forandring: (forra && forra.version === sista.version) ? sista.poang - forra.poang : null
          } : null;
          sprakMap[r.user_id] = { pass, ratt, totalt, tidSek, test };
        });
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
          u.sprak = sprakMap[u.user_id] || { pass: 0, ratt: 0, totalt: 0, tidSek: 0, test: null };
        });
      }
      return res.status(200).json({ data: users });
    }

    if (action === 'admin_resolve_participant_by_email') {
      // Tar e-post → returnerar deltagarens riktiga auth-UUID + skapar
      // user_assignments-rad om den saknas (kopplad till admins kommun/enhet).
      // Används av handläggar-vyn för att slå upp riktiga UUID:n för
      // FORCE_SHOW_AS_USER-stubar (mailar som även är admins men ska gå
      // att tilldela uppgifter till för pilot-testning).
      const { admin } = await requireAdmin(res, accessToken, action);
      if (!admin) return;
      const lookupEmail = (email || '').toString().trim().toLowerCase();
      if (!lookupEmail || !lookupEmail.includes('@')) {
        return res.status(400).json({ error: 'invalid_email' });
      }
      // 1) Slå upp auth.users via Admin API
      const authRes = await makeRequest(
        `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(lookupEmail)}`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const authUsers = Array.isArray(authRes.data?.users) ? authRes.data.users : (Array.isArray(authRes.data) ? authRes.data : []);
      const authUser = authUsers.find(u => (u.email || '').toLowerCase() === lookupEmail);
      if (!authUser?.id) return res.status(404).json({ error: 'no_auth_user' });
      const realUid = authUser.id;
      // 2) Kolla om user_assignments redan finns
      const uaRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(realUid)}&select=user_id,kommun_id,enhet_id&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const existing = Array.isArray(uaRes.data) ? uaRes.data : [];
      if (existing.length) {
        return res.status(200).json({ user_id: realUid, created: false, assignment: existing[0] });
      }
      // 3) Skapa raden — använd admins kommun/enhet
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } },
        {
          user_id: realUid,
          kommun_id: admin.kommun_id || null,
          enhet_id: admin.enhet_id || null,
          status: 'active',
          created_at: new Date().toISOString()
        }
      );
      return res.status(200).json({ user_id: realUid, created: true });
    }

    if (action === 'admin_get_diary_stats') {
      // Returnerar { applied_count, last_applied_at } för en deltagare.
      // Verifierar att admin har behörighet att se den specifika user_id:n.
      const uid = targetUserId || userId;
      if (!uid) return res.status(400).json({ error: 'targetUserId krävs' });
      const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
      if (!admin) return;
      // Anropa PostgreSQL-funktionen admin_get_diary_stats (från migrationen).
      // RPC-endpoint: POST /rest/v1/rpc/admin_get_diary_stats med { p_user_id }
      const rpc = await makeRequest(
        `${SUPABASE_URL}/rest/v1/rpc/admin_get_diary_stats`,
        { method: 'POST', headers: serviceHeaders() },
        { p_user_id: uid }
      );
      if (rpc.status >= 400) {
        console.warn('[admin_get_diary_stats] RPC fel:', rpc.status, maskPII(rpc.data));
        // Fallback: läs job_diary direkt och räkna i Node om RPC inte finns
        const dr = await makeRequest(
          `${SUPABASE_URL}/rest/v1/job_diary?user_id=eq.${uid}&select=data&limit=1`,
          { method: 'GET', headers: serviceHeaders() }
        );
        const rows = Array.isArray(dr.data) ? dr.data : [];
        const arr = (rows[0] && Array.isArray(rows[0].data)) ? rows[0].data : [];
        const applied = arr.filter(e => e && e.applied === true);
        const lastTs = applied.reduce((max, e) => Math.max(max, Number(e.appliedAt) || 0), 0);
        return res.status(200).json({
          applied_count: applied.length,
          last_applied_at: lastTs ? new Date(lastTs).toISOString() : null
        });
      }
      const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
      return res.status(200).json({
        applied_count: (row && row.applied_count) || 0,
        last_applied_at: (row && row.last_applied_at) || null
      });
    }

    if (action === 'admin_list_diary_stats') {
      // Batch: tar { userIds: [uuid,...] } och returnerar
      // { stats: { uuid: { applied_count, last_applied_at } } }
      // Behörighet: admin måste ha verifierad inloggning. Filtrering till
      // egen kommun/enhet sker via att vi bara hämtar för user_ids som
      // admin redan listat (de har redan passerat tenant-check i admin_list_users).
      const { admin } = await requireAdmin(res, accessToken, action);
      if (!admin) return;
      const rawIds = Array.isArray(req.body?.userIds) ? req.body.userIds.filter(Boolean) : [];
      if (!rawIds.length) return res.status(200).json({ stats: {} });
      // #20: Re-validera per-user att varje id ligger inom admins tenant.
      // Skyddar mot att en angripare skickar in user-IDs från annan kommun.
      const inListAll = safeUuidIn(rawIds);
      if (!inListAll) return res.status(200).json({ stats: {} });
      let allowedIds = rawIds;
      if (admin.role !== 'superadmin') {
        const uaRes = await makeRequest(
          `${SUPABASE_URL}/rest/v1/user_assignments?user_id=in.(${inListAll})&select=user_id,kommun_id,enhet_id`,
          { method: 'GET', headers: serviceHeaders() }
        );
        const allowed = (Array.isArray(uaRes.data) ? uaRes.data : [])
          .filter(u => String(u.kommun_id) === String(admin.kommun_id)
                    && (admin.enhet_id == null || String(u.enhet_id) === String(admin.enhet_id)))
          .map(u => u.user_id);
        allowedIds = allowed;
      }
      const inList = safeUuidIn(allowedIds);
      if (!inList) return res.status(200).json({ stats: {} });
      const dr = await makeRequest(
        `${SUPABASE_URL}/rest/v1/job_diary?user_id=in.(${inList})&select=user_id,data`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rows = Array.isArray(dr.data) ? dr.data : [];
      const stats = {};
      allowedIds.forEach(u => { stats[u] = { applied_count: 0, last_applied_at: null }; });
      rows.forEach(r => {
        const arr = Array.isArray(r.data) ? r.data : [];
        const applied = arr.filter(e => e && e.applied === true);
        const lastTs = applied.reduce((max, e) => Math.max(max, Number(e.appliedAt) || 0), 0);
        stats[r.user_id] = {
          applied_count: applied.length,
          last_applied_at: lastTs ? new Date(lastTs).toISOString() : null
        };
      });
      return res.status(200).json({ stats });
    }

    if (action === 'admin_get_user') {
      const uid = targetUserId || userId;
      {
        const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
        if (!admin) return;
      }
      const [assignRes, cvRes, progressRes, tasksRes, matchRes, diaryRes, eduRes, savedCvRes, intervRes] = await Promise.all([
        makeRequest(`${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${uid}&select=*&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/cvs?user_id=eq.${uid}&select=data,updated_at&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/ovning_progress?user_id=eq.${uid}&select=progress&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=eq.${uid}&select=*&order=created_at.desc`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/matched_cvs?user_id=eq.${uid}&select=data&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/job_diary?user_id=eq.${uid}&select=data&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_edu?user_id=eq.${uid}&select=data&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/saved_cvs?user_id=eq.${uid}&select=data&limit=1`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/interview_sessions?user_id=eq.${uid}&select=id,branch,company,role_title,status,created_at&order=created_at.desc`, { method: 'GET', headers: serviceHeaders() }),
      ]);
      const pick = (r, key) => { const rows = Array.isArray(r.data) ? r.data : []; return rows[0]?.[key] || null; };
      const intervRows = Array.isArray(intervRes.data) ? intervRes.data : [];
      return res.status(200).json({
        assignment: (Array.isArray(assignRes.data) ? assignRes.data : [])[0] || null,
        cv: pick(cvRes, 'data'),
        cv_updated: pick(cvRes, 'updated_at'),
        progress: pick(progressRes, 'progress'),
        tasks: Array.isArray(tasksRes.data) ? tasksRes.data : [],
        matchedCvs: pick(matchRes, 'data'),
        job_diary: pick(diaryRes, 'data'),
        saved_edu: pick(eduRes, 'data'),
        saved_cvs: pick(savedCvRes, 'data'),
        interview_sessions: intervRows,
        interview_sessions_completed: intervRows.filter(s => s.status === 'completed').length
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
      await logAdminAction(filters?.adminId, 'assign_task', { target_user_id: targetUserId, category });
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

    if (action === 'admin_delete_user') {
      // GDPR-radering: admin tar bort en deltagare ur sin tenant.
      // Raderar alla deltagar-rader + auth.users (kaskad-radering).
      const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: req.body?.targetUserId });
      if (!admin) return;
      const targetUserId = req.body?.targetUserId;
      if (!targetUserId) return res.status(400).json({ error: 'targetUserId krävs' });
      const TABLES = ['user_assignments','cvs','saved_cvs','matched_cvs','saved_edu','job_diary','ovning_progress','sprak_progress','program_logg','narvaro','tasks','task_sessions','interview_messages','interview_sessions','saved_questions','admin_activity_log'];
      for (const t of TABLES) {
        await makeRequest(`${SUPABASE_URL}/rest/v1/${t}?user_id=eq.${targetUserId}`, { method: 'DELETE', headers: serviceHeaders() });
      }
      // Konsumera ev. öppna user_invites för samma user
      await makeRequest(`${SUPABASE_URL}/rest/v1/user_invites?consumed_user_id=eq.${targetUserId}`, { method: 'DELETE', headers: serviceHeaders() });
      // Radera auth.users via Supabase Admin API
      await makeRequest(`${SUPABASE_URL}/auth/v1/admin/users/${targetUserId}`, { method: 'DELETE', headers: serviceHeaders() });
      // Audit
      await makeRequest(`${SUPABASE_URL}/rest/v1/admin_audit`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, { admin_id: admin.id, action: 'admin_delete_user', details: { target_user_id: targetUserId } });
      return res.status(200).json({ ok: true });
    }

    if (action === 'user_delete_self') {
      // GDPR: deltagare raderar sitt eget konto.
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      const TABLES = ['user_assignments','cvs','saved_cvs','matched_cvs','saved_edu','job_diary','ovning_progress','sprak_progress','program_logg','narvaro','tasks','task_sessions','interview_messages','interview_sessions','saved_questions','admin_activity_log'];
      for (const t of TABLES) {
        await makeRequest(`${SUPABASE_URL}/rest/v1/${t}?user_id=eq.${jwt.id}`, { method: 'DELETE', headers: serviceHeaders() });
      }
      await makeRequest(`${SUPABASE_URL}/rest/v1/user_invites?consumed_user_id=eq.${jwt.id}`, { method: 'DELETE', headers: serviceHeaders() });
      await makeRequest(`${SUPABASE_URL}/auth/v1/admin/users/${jwt.id}`, { method: 'DELETE', headers: serviceHeaders() });
      return res.status(200).json({ ok: true });
    }

    if (action === 'admin_invite') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: kommunId, requestedEnhetId: enhetId
      });
      if (!admin) return;
      let inviteKommunId = kommunId, inviteEnhetId = enhetId, inviteRole = role || 'handlaggare';

      // Behörighetsmatris per inbjudarens roll
      if (admin.role === 'superadmin') {
        // får bjuda in vad som helst
      } else if (admin.role === 'kommunadmin') {
        inviteKommunId = admin.kommun_id;                      // låst till egen kommun
        if (!['kommunadmin','enhetsadmin','handlaggare'].includes(inviteRole)) {
          return res.status(403).json({ error: 'forbidden_role' });
        }
      } else if (admin.role === 'enhetsadmin') {
        inviteKommunId = admin.kommun_id;
        inviteEnhetId  = admin.enhet_id;                        // låst till egen enhet
        if (inviteRole !== 'handlaggare') {
          return res.status(403).json({ error: 'forbidden_role' });
        }
      } else {
        return res.status(403).json({ error: 'forbidden' });    // handläggare får ej bjuda in admins
      }

      const existing = await makeRequest(`${SUPABASE_URL}/rest/v1/admins?email=eq.${encodeURIComponent(email)}&limit=1`, { method: 'GET', headers: serviceHeaders() });
      if (Array.isArray(existing.data) && existing.data.length) return res.status(409).json({ error: 'E-postadressen finns redan' });
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const result = await makeRequest(`${SUPABASE_URL}/rest/v1/admins`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } }, { name: personName || email.split('@')[0], email: email.toLowerCase(), role: inviteRole, kommun_id: inviteKommunId || null, enhet_id: inviteEnhetId || null, invite_token: inviteToken, invite_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
      const rows = Array.isArray(result.data) ? result.data : [];
      await logAdminAction(admin.id, 'admin_invite', { invited_role: inviteRole, kommun_id: inviteKommunId, enhet_id: inviteEnhetId });
      return res.status(201).json({ admin: rows[0] || null, invite_token: inviteToken });
    }

    if (action === 'admin_list_admins') {
      const { admin } = await requireAdmin(res, accessToken, action, {
        requestedKommunId: filters?.kommun_id
      });
      if (!admin) return;
      // Returnera bara säkra kolumner — invite_token är en credential och får
      // aldrig lämna backend. Vi exponerar `pending_invite` (boolean) istället.
      let url = `${SUPABASE_URL}/rest/v1/admins?select=id,email,name,role,kommun_id,enhet_id,last_login,invite_token,invite_expires,kommuner(name),enheter(name)&order=role.asc,name.asc`;
      const scopeKommunId = admin.role === 'superadmin' ? filters?.kommun_id : admin.kommun_id;
      if (scopeKommunId) url += `&kommun_id=eq.${scopeKommunId}`;
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      const rows = (Array.isArray(result.data) ? result.data : []).map(r => ({
        id: r.id, email: r.email, name: r.name, role: r.role,
        kommun_id: r.kommun_id, enhet_id: r.enhet_id,
        last_login: r.last_login,
        kommuner: r.kommuner, enheter: r.enheter,
        pending_invite: !!(r.invite_token && !r.last_login),
        invite_expires: r.invite_expires
      }));
      return res.status(200).json({ data: rows });
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
      if (scopeKommunId) userUrl += `&kommun_id=eq.${encodeURIComponent(scopeKommunId)}`;
      if (scopeEnhetId)  userUrl += `&enhet_id=eq.${encodeURIComponent(scopeEnhetId)}`;
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
          const idsFilter = safeUuidIn(statUserIds);
          if (!idsFilter) { tasks = []; }
          else {
          const taskRes = await makeRequest(`${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=status,category,time_spent_sec,user_id`, { method: 'GET', headers: serviceHeaders() });
          tasks = Array.isArray(taskRes.data) ? taskRes.data : [];
          }
        }
      }
      return res.status(200).json({
        users: { total: users.length, active: users.filter(u => u.status === 'active').length, recent: users.filter(u => u.status === 'recent').length, new_count: users.filter(u => u.status === 'new').length, inactive: users.filter(u => u.status === 'inactive').length },
        tasks: { total: tasks.length, completed: tasks.filter(t => t.status === 'completed').length, pending: tasks.filter(t => t.status === 'pending').length, active: tasks.filter(t => t.status === 'active').length, expired: tasks.filter(t => t.status === 'expired').length, total_time_sec: tasks.reduce((s, t) => s + (t.time_spent_sec || 0), 0) },
        byCategory: Object.entries(tasks.reduce((acc, t) => { if (!acc[t.category]) acc[t.category] = { total: 0, completed: 0 }; acc[t.category].total++; if (t.status === 'completed') acc[t.category].completed++; return acc; }, {})).map(([cat, data]) => ({ category: cat, ...data })),
      });
    }

    if (action === 'user_invite') {
      // Handläggare/admin bjuder in en deltagare. Skapar token, ingen mejl-utskick än.
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const inviteEmail = (email || '').toLowerCase().trim();
      if (!inviteEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
        return res.status(400).json({ error: 'Ogiltig e-postadress' });
      }
      // Scope: superadmin får välja kommun/enhet fritt, övriga låses till egen
      let inviteKommunId = kommunId || null, inviteEnhetId = enhetId || null;
      if (admin.role !== 'superadmin') {
        inviteKommunId = admin.kommun_id;
        if (admin.enhet_id != null) inviteEnhetId = admin.enhet_id;
      }
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dagar
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_invites`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } },
        { email: inviteEmail, token, kommun_id: inviteKommunId, enhet_id: inviteEnhetId,
          invited_by: admin.id, invite_message: req.body?.message || null, expires_at: expires }
      );
      if (result.status >= 400) {
        console.error('[user_invite] DB-insert failed:', maskPII(result.data));
        return res.status(500).json({ error: 'Kunde inte skapa inbjudan' });
      }

      // Skicka mejl via Supabase Auth (som i sin tur går via Resend SMTP).
      // signInWithOtp + shouldCreateUser:true skickar en magic-link med vår invite-token
      // i redirectTo, så att vår frontend kan plocka upp den och koppla kommun/enhet.
      const origin = req.headers?.origin || req.headers?.referer?.split('/').slice(0,3).join('/') || '';
      const redirectTo = origin
        ? `${origin}/?invite=${encodeURIComponent(token)}`
        : `https://cvmatchen.com/?invite=${encodeURIComponent(token)}`;
      let emailSent = false, emailError = null;
      try {
        // /auth/v1/invite skickar en magic-link-mejl med klickbar URL,
        // till skillnad mot /auth/v1/otp som skickar en 6-siffrig kod.
        // Kräver service-role-nyckel.
        const mailRes = await makeRequest(
          `${SUPABASE_URL}/auth/v1/invite?redirect_to=${encodeURIComponent(redirectTo)}`,
          { method: 'POST', headers: serviceHeaders() },
          { email: inviteEmail, data: { invited_by_admin_id: admin.id, kommun_id: inviteKommunId, enhet_id: inviteEnhetId } }
        );
        emailSent = mailRes.status < 400;
        if (!emailSent) emailError = mailRes.data;
      } catch(e) { emailError = String(e); }

      const rows = Array.isArray(result.data) ? result.data : [];
      await logAdminAction(admin.id, 'user_invite', { kommun_id: inviteKommunId, enhet_id: inviteEnhetId, email_sent: emailSent });
      return res.status(201).json({
        invite: rows[0] || null,
        invite_token: token,
        email_sent: emailSent,
        email_error: emailError ? String(emailError).slice(0, 200) : null
      });
    }

    if (action === 'list_user_invites') {
      // Öppna (ej konsumerade) deltagar-inbjudningar inom adminens scope,
      // så handläggaren ser vilka som väntar och kan skicka om.
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      let url = `${SUPABASE_URL}/rest/v1/user_invites?consumed_at=is.null&select=id,email,kommun_id,enhet_id,expires_at,created_at,invited_by&order=created_at.desc&limit=100`;
      if (admin.role !== 'superadmin' && admin.kommun_id) {
        url += `&kommun_id=eq.${admin.kommun_id}`;
        if (admin.enhet_id != null && admin.role === 'handlaggare') url += `&enhet_id=eq.${admin.enhet_id}`;
      }
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      if (result.status >= 400) {
        console.warn('[list_user_invites] DB-fel:', result.status, maskPII(result.data));
        return res.status(500).json({ error: 'Kunde inte hämta inbjudningar' });
      }
      return res.status(200).json({ invites: Array.isArray(result.data) ? result.data : [] });
    }

    if (action === 'resend_user_invite') {
      // Skickar om magic-link-mejlet för en öppen inbjudan + förlänger giltigheten.
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const inviteId = req.body?.inviteId;
      if (!inviteId) return res.status(400).json({ error: 'inviteId krävs' });
      const invRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_invites?id=eq.${encodeURIComponent(inviteId)}&consumed_at=is.null&select=id,email,token,kommun_id,enhet_id&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const inv = Array.isArray(invRes.data) && invRes.data[0];
      if (!inv) return res.status(404).json({ error: 'Inbjudan hittades inte (eller är redan använd)' });
      // Tenant-kontroll: bara superadmin får röra andra kommuners invites.
      if (admin.role !== 'superadmin' && String(inv.kommun_id) !== String(admin.kommun_id)) {
        await logAdminDenied(admin.id, action, 'cross_tenant_invite');
        return res.status(403).json({ error: 'forbidden' });
      }
      // Förläng giltigheten 30 dagar från nu.
      const newExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_invites?id=eq.${encodeURIComponent(inviteId)}`,
        { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        { expires_at: newExpires }
      );
      const origin = req.headers?.origin || req.headers?.referer?.split('/').slice(0,3).join('/') || '';
      const redirectTo = origin
        ? `${origin}/?invite=${encodeURIComponent(inv.token)}`
        : `https://cvmatchen.com/?invite=${encodeURIComponent(inv.token)}`;
      let emailSent = false, emailError = null;
      try {
        // Redan registrerade användare kan inte re-invitas via /auth/v1/invite
        // (422) — fall då tillbaka på magic-link via /auth/v1/magiclink.
        let mailRes = await makeRequest(
          `${SUPABASE_URL}/auth/v1/invite?redirect_to=${encodeURIComponent(redirectTo)}`,
          { method: 'POST', headers: serviceHeaders() },
          { email: inv.email, data: { invited_by_admin_id: admin.id, kommun_id: inv.kommun_id, enhet_id: inv.enhet_id } }
        );
        if (mailRes.status === 422) {
          mailRes = await makeRequest(
            `${SUPABASE_URL}/auth/v1/magiclink?redirect_to=${encodeURIComponent(redirectTo)}`,
            { method: 'POST', headers: serviceHeaders() },
            { email: inv.email }
          );
        }
        emailSent = mailRes.status < 400;
        if (!emailSent) emailError = mailRes.data;
      } catch(e) { emailError = String(e); }
      await logAdminAction(admin.id, 'resend_user_invite', { invite_id: inviteId, email_sent: emailSent });
      return res.status(200).json({
        ok: true, email_sent: emailSent, invite_token: inv.token,
        email_error: emailError ? maskPII(String(emailError)).slice(0, 200) : null
      });
    }

    if (action === 'admin_overview_per_kommun') {
      // Superadmin-överblick: en rad per kommun med pilot-status och nyckeltal.
      // Övriga admins ser bara sin egen kommun.
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;

      let komUrl = `${SUPABASE_URL}/rest/v1/kommuner?select=id,name,is_pilot,pilot_ends,contact_email&order=name`;
      if (admin.role !== 'superadmin' && admin.kommun_id) {
        komUrl += `&id=eq.${admin.kommun_id}`;
      }
      const [komRes, uaRes, adminsRes, enhRes] = await Promise.all([
        makeRequest(komUrl, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/user_assignments?select=user_id,kommun_id,status`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/admins?select=id,role,kommun_id`, { method: 'GET', headers: serviceHeaders() }),
        makeRequest(`${SUPABASE_URL}/rest/v1/enheter?select=id,kommun_id`, { method: 'GET', headers: serviceHeaders() })
      ]);

      const kommuner = Array.isArray(komRes.data) ? komRes.data : [];
      const allUA    = Array.isArray(uaRes.data) ? uaRes.data : [];
      const allAdm   = Array.isArray(adminsRes.data) ? adminsRes.data : [];
      const allEnh   = Array.isArray(enhRes.data) ? enhRes.data : [];

      // Hämta tasks för alla relevanta deltagare i en bulk
      const allUserIds = allUA.map(u => u.user_id).filter(Boolean);
      let tasks = [];
      if (allUserIds.length) {
        const idsFilter = safeUuidIn(allUserIds);
        if (idsFilter) {
        const taskRes = await makeRequest(
          `${SUPABASE_URL}/rest/v1/tasks?user_id=in.(${idsFilter})&select=user_id,status`,
          { method: 'GET', headers: serviceHeaders() }
        );
        tasks = Array.isArray(taskRes.data) ? taskRes.data : [];
        }
      }

      const userIdToKommun = new Map(allUA.map(u => [u.user_id, u.kommun_id]));

      const rows = kommuner.map(k => {
        const ua = allUA.filter(u => u.kommun_id === k.id);
        const adm = allAdm.filter(a => a.kommun_id === k.id);
        const enh = allEnh.filter(e => e.kommun_id === k.id);
        const kTasks = tasks.filter(t => userIdToKommun.get(t.user_id) === k.id);
        return {
          id: k.id, name: k.name, is_pilot: k.is_pilot, pilot_ends: k.pilot_ends,
          contact_email: k.contact_email,
          users: {
            total: ua.length,
            active: ua.filter(u => u.status === 'active').length,
            recent: ua.filter(u => u.status === 'recent').length,
            new_count: ua.filter(u => u.status === 'new').length,
            inactive: ua.filter(u => u.status === 'inactive').length
          },
          enheter: enh.length,
          admins: adm.length,
          tasks: { total: kTasks.length, completed: kTasks.filter(t => t.status === 'completed').length }
        };
      });

      return res.status(200).json({ data: rows });
    }

    if (action === 'admin_resend_invite') {
      // Genererar ny invite_token för en admin som inte loggat in än,
      // och returnerar en kopierbar länk (mejl-utskick kan läggas till senare).
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const adminId = req.body?.targetAdminId;
      if (!adminId) return res.status(400).json({ error: 'targetAdminId krävs' });
      const targetRes = await makeRequest(`${SUPABASE_URL}/rest/v1/admins?id=eq.${encodeURIComponent(adminId)}&select=id,email,role,kommun_id,enhet_id,last_login&limit=1`, { method: 'GET', headers: serviceHeaders() });
      const target = (Array.isArray(targetRes.data) ? targetRes.data : [])[0];
      if (!target) return res.status(404).json({ error: 'Admin saknas' });
      if (target.last_login) return res.status(400).json({ error: 'Admin har redan aktiverat sitt konto' });
      // Behörighet: superadmin = alla; kommunadmin = inom egen kommun; enhetsadmin = inom egen enhet
      if (admin.role !== 'superadmin') {
        if (String(target.kommun_id) !== String(admin.kommun_id)) return res.status(403).json({ error: 'forbidden' });
        if (admin.role === 'enhetsadmin' && String(target.enhet_id) !== String(admin.enhet_id)) return res.status(403).json({ error: 'forbidden' });
      }
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await makeRequest(`${SUPABASE_URL}/rest/v1/admins?id=eq.${target.id}`, { method: 'PATCH', headers: serviceHeaders() }, { invite_token: newToken, invite_expires: newExpires });
      await logAdminAction(admin.id, 'admin_resend_invite', { target_admin_id: target.id });
      return res.status(200).json({ invite_token: newToken });
    }

    // ═══════════════════════════════════════════════════════════════
    // PROGRAM — fas, spår, datum, programstatus och verifierad sfi-nivå
    // för deltagare i en programverksamhet. Varje ändring loggas i
    // program_logg (vem, när, från, till).
    // ═══════════════════════════════════════════════════════════════
    const PROGRAM_VAL = {
      spar:          ['ordinarie', 'foraldraspar'],
      fas:           ['landa', 'rusta', 'valja_soka'],
      programstatus: ['aktiv', 'avslutad', 'avbrott'],
      sfi_kurs:      ['ingen', 'A', 'B', 'C', 'D', 'klar_D'],
      sfi_betyg:     ['A', 'B', 'C', 'D', 'E', 'F', 'pagar']
    };
    const PROGRAM_DATUM = ['program_start', 'program_slut'];
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // requestedUserId låser bara till kommun. För skrivning låses också
    // till enhet för den som har en — samma regel som deltagarlistan.
    async function befordraFas(rad) {
      const idag = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
      if (!rad || !rad.fas_ny || !rad.fas_ny_fran || rad.fas_ny_fran > idag) return rad;
      const patch = { fas: rad.fas_ny, fas_andrad_at: rad.fas_ny_fran + 'T00:00:00+01:00', fas_ny: null, fas_ny_fran: null };
      await makeRequest(`${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(rad.user_id)}&fas_ny_fran=eq.${rad.fas_ny_fran}`,
        { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, patch);
      return { ...rad, ...patch };
    }

    async function hamtaProgramDeltagare(admin, uid) {
      const r = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(uid)}&select=*&limit=1`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rad = await befordraFas((Array.isArray(r.data) ? r.data : [])[0]);
      if (!rad) return { fel: 404 };
      if (admin.role !== 'superadmin' && admin.enhet_id != null
          && String(rad.enhet_id) !== String(admin.enhet_id)) return { fel: 403 };
      return { rad };
    }

    if (action === 'admin_update_program') {
      const uid = targetUserId;
      if (!uid || !UUID_RE.test(uid)) return res.status(400).json({ error: 'Ogiltigt deltagar-id' });
      const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
      if (!admin) return;
      const { rad: cur, fel } = await hamtaProgramDeltagare(admin, uid);
      if (fel === 404) return res.status(404).json({ error: 'Deltagaren saknas' });
      if (fel === 403) return res.status(403).json({ error: 'Deltagaren tillhör en annan enhet' });

      let indata = (req.body && typeof req.body.program === 'object' && req.body.program) || {};
      const patch = {};
      const logg = [];

      // Fasbyte (F2.6): en deltagare som redan har en fas byter från nästa
      // måndag, så att veckans schema inte ändras mitt i veckan. Första
      // fasen sätts direkt (en ny deltagare ska få rätt schema på en gång),
      // liksom när personalen uttryckligen väljer att rätta direkt.
      let fasPlan = null;
      if ('fas' in indata) {
        const ny = indata.fas === '' || indata.fas == null ? null : String(indata.fas);
        if (ny !== null && !PROGRAM_VAL.fas.includes(ny)) return res.status(400).json({ error: 'Ogiltigt värde för fas' });
        const direkt = !!(req.body && req.body.fasDirekt) || !cur.fas || ny === null;
        let hanterad = false;
        if (direkt) {
          // Direktbyte: ett ev. planerat byte ersätts av det som sätts nu
          if (cur.fas_ny && ny === cur.fas) fasPlan = { fas_ny: null, fas_ny_fran: null };
        } else if (ny === (cur.fas_ny ?? null)) {
          hanterad = true;                                   // oförändrat planerat byte — behåll datumet
        } else if (ny === cur.fas) {
          hanterad = true;
          if (cur.fas_ny) fasPlan = { fas_ny: null, fas_ny_fran: null };   // tillbaka till nuvarande = avbryt
        } else {
          hanterad = true;
          const t = new Date(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }) + 'T12:00:00Z');
          t.setUTCDate(t.getUTCDate() + (8 - (t.getUTCDay() || 7)));
          fasPlan = { fas_ny: ny, fas_ny_fran: t.toISOString().slice(0, 10) };
        }
        if (hanterad) { indata = { ...indata }; delete indata.fas; }
      }

      for (const falt of Object.keys(PROGRAM_VAL)) {
        if (!(falt in indata)) continue;
        const v = indata[falt] === '' || indata[falt] == null ? null : String(indata[falt]);
        if (v !== null && !PROGRAM_VAL[falt].includes(v)) {
          return res.status(400).json({ error: `Ogiltigt värde för ${falt}` });
        }
        if (v !== (cur[falt] ?? null)) { patch[falt] = v; logg.push({ typ: falt, fran: cur[falt] ?? null, till: v }); }
      }
      for (const falt of PROGRAM_DATUM) {
        if (!(falt in indata)) continue;
        const v = indata[falt] === '' || indata[falt] == null ? null : String(indata[falt]);
        if (v !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(Date.parse(v)))) {
          return res.status(400).json({ error: `Ogiltigt datum för ${falt}` });
        }
        if (v !== (cur[falt] ?? null)) { patch[falt] = v; logg.push({ typ: falt, fran: cur[falt] ?? null, till: v }); }
      }

      const start = 'program_start' in patch ? patch.program_start : cur.program_start;
      const slut  = 'program_slut'  in patch ? patch.program_slut  : cur.program_slut;
      if (start && slut && slut < start) {
        return res.status(400).json({ error: 'Slutdatum kan inte ligga före startdatum' });
      }

      if (fasPlan && (fasPlan.fas_ny !== (cur.fas_ny ?? null) || fasPlan.fas_ny_fran !== (cur.fas_ny_fran ?? null))) {
        patch.fas_ny = fasPlan.fas_ny;
        patch.fas_ny_fran = fasPlan.fas_ny_fran;
        logg.push(fasPlan.fas_ny
          ? { typ: 'fas_planerad', fran: cur.fas ?? null, till: fasPlan.fas_ny + '@' + fasPlan.fas_ny_fran }
          : { typ: 'fas_planerad', fran: cur.fas_ny ?? null, till: null });
      }
      if ('fas' in patch) { patch.fas_ny = null; patch.fas_ny_fran = null; }

      if (!logg.length) return res.status(200).json({ assignment: cur, andrat: 0 });

      const nu = new Date().toISOString();
      if ('fas' in patch) patch.fas_andrad_at = nu;
      if ('sfi_kurs' in patch || 'sfi_betyg' in patch) {
        patch.sfi_verifierad_av = admin.id;
        patch.sfi_verifierad_at = nu;
      }

      const upd = await makeRequest(
        `${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${encodeURIComponent(uid)}`,
        { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } },
        patch
      );
      if (upd.status >= 400) {
        console.warn('[admin_update_program] PATCH misslyckades:', upd.status, maskPII(upd.data));
        return res.status(400).json({ error: 'Kunde inte spara programuppgifterna' });
      }
      await makeRequest(
        `${SUPABASE_URL}/rest/v1/program_logg`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } },
        logg.map(l => ({ user_id: uid, typ: l.typ, fran: l.fran, till: l.till, admin_id: admin.id }))
      );
      await logAdminAction(admin.id, 'admin_update_program', { target_user_id: uid, falt: logg.map(l => l.typ) });
      const ny = (Array.isArray(upd.data) ? upd.data : [])[0] || { ...cur, ...patch };
      return res.status(200).json({ assignment: ny, andrat: logg.length });
    }

    if (action === 'admin_get_program_logg') {
      const uid = targetUserId;
      if (!uid || !UUID_RE.test(uid)) return res.status(400).json({ error: 'Ogiltigt deltagar-id' });
      const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
      if (!admin) return;
      const { fel } = await hamtaProgramDeltagare(admin, uid);
      if (fel === 404) return res.status(404).json({ error: 'Deltagaren saknas' });
      if (fel === 403) return res.status(403).json({ error: 'Deltagaren tillhör en annan enhet' });
      const r = await makeRequest(
        `${SUPABASE_URL}/rest/v1/program_logg?user_id=eq.${encodeURIComponent(uid)}&select=typ,fran,till,skapad_at,admins(name)&order=skapad_at.desc&limit=50`,
        { method: 'GET', headers: serviceHeaders() }
      );
      const rader = (Array.isArray(r.data) ? r.data : []).map(x => ({
        typ: x.typ, fran: x.fran, till: x.till, skapad_at: x.skapad_at, av: x.admins?.name || null
      }));
      return res.status(200).json({ logg: rader });
    }

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA OCH NÄRVARO (kravspec F1 + grund för F2)
    //
    // pass_mall    = veckoschemat, en rad per veckodag. Rader med samma
    //                serie_id är en serie och kan ändras tillsammans.
    // pass_instans = ett faktiskt pass ett visst datum. Skapas från
    //                mallen första gången dagen öppnas, med tid, titel
    //                och målgrupp kopierade — så att en senare ändring
    //                aldrig skriver om vad som gällde ett passerat datum.
    // narvaro      = en rad per deltagare och pass.
    // ═══════════════════════════════════════════════════════════════
    const NV_DAG_RE = /^\d{4}-\d{2}-\d{2}$/;
    const NV_TID_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
    const NV_TYPER = ['L', 'U', 'A', 'D'];
    const NV_STATUS = ['narvarande', 'sen', 'franvarande_giltig', 'franvarande_ogiltig'];
    const nvIdag = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
    const nvVeckodag = d => { const w = new Date(d + 'T12:00:00Z').getUTCDay(); return w === 0 ? 7 : w; };
    const nvMandagMs = d => { const t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() || 7) - 1)); return t.getTime(); };
    const nvVeckorMellan = (a, b) => Math.round((nvMandagMs(b) - nvMandagMs(a)) / (7 * 86400000));
    const nvDagFore = d => { const t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() - 1); return t.toISOString().slice(0, 10); };
    const nvMin = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };
    const nvRows = r => (Array.isArray(r.data) ? r.data : []);
    const nvGET = () => ({ method: 'GET', headers: serviceHeaders() });
    const nvPATCH = (extra) => ({ method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal', ...(extra || {}) } });
    const nvTid = t => String(t).slice(0, 5);

    // Vilken verksamhet gäller anropet? Övriga roller låses till sin egen;
    // superadmin anger kommun (och ev. enhet) och vi kontrollerar att de hör ihop.
    async function nvScope(admin, body) {
      if (admin.role !== 'superadmin') {
        if (!admin.kommun_id) return { fel: 'Ditt konto saknar kommun' };
        return { kommun_id: admin.kommun_id, enhet_id: admin.enhet_id ?? null };
      }
      const k = parseInt(body?.kommunId, 10);
      if (!Number.isFinite(k)) return { fel: 'Välj kommun' };
      let e = null;
      if (body?.enhetId != null && body.enhetId !== '') {
        e = parseInt(body.enhetId, 10);
        if (!Number.isFinite(e)) return { fel: 'Ogiltig enhet' };
        const r = await makeRequest(`${SUPABASE_URL}/rest/v1/enheter?id=eq.${e}&kommun_id=eq.${k}&select=id&limit=1`, nvGET());
        if (!nvRows(r).length) return { fel: 'Enheten hör inte till kommunen' };
      }
      return { kommun_id: k, enhet_id: e };
    }
    const nvScopeFilter = s => `kommun_id=eq.${s.kommun_id}&enhet_id=${s.enhet_id == null ? 'is.null' : 'eq.' + s.enhet_id}`;
    function nvIScope(admin, rad) {
      if (admin.role === 'superadmin') return true;
      if (String(rad.kommun_id) !== String(admin.kommun_id)) return false;
      if (admin.enhet_id != null && String(rad.enhet_id) !== String(admin.enhet_id)) return false;
      return true;
    }

    function nvValidera(f, kravAlla) {
      const ut = {};
      if (kravAlla || 'titel' in f) {
        const t = String(f.titel || '').trim();
        if (!t || t.length > 120) return { fel: 'Titeln måste vara 1–120 tecken' };
        ut.titel = t;
      }
      if (kravAlla || 'typ' in f) {
        if (!NV_TYPER.includes(f.typ)) return { fel: 'Välj typ av pass' };
        ut.typ = f.typ;
      }
      for (const k of ['starttid', 'sluttid']) {
        if (kravAlla || k in f) {
          if (!NV_TID_RE.test(String(f[k] || ''))) return { fel: k === 'starttid' ? 'Ogiltig starttid' : 'Ogiltig sluttid' };
          ut[k] = nvTid(f[k]);
        }
      }
      if (ut.starttid && ut.sluttid && nvMin(ut.sluttid) <= nvMin(ut.starttid)) return { fel: 'Sluttiden måste vara efter starttiden' };
      if ('faser' in f) {
        const a = Array.isArray(f.faser) ? f.faser : [];
        if (a.some(x => !PROGRAM_VAL.fas.includes(x))) return { fel: 'Ogiltig fas' };
        ut.faser = a.length ? a : null;
      }
      if ('spar' in f) {
        const a = Array.isArray(f.spar) ? f.spar : [];
        if (a.some(x => !PROGRAM_VAL.spar.includes(x))) return { fel: 'Ogiltigt spår' };
        ut.spar = a.length ? a : null;
      }
      return { ut };
    }

    // Skapar dagens pass ur veckoschemat om de inte redan finns.
    async function nvSkapaPass(sc, datum) {
      const r = await makeRequest(
        `${SUPABASE_URL}/rest/v1/pass_mall?${nvScopeFilter(sc)}&veckodag=eq.${nvVeckodag(datum)}&aktiv=eq.true` +
        `&giltig_fran=lte.${datum}&or=(giltig_till.is.null,giltig_till.gte.${datum})&select=*`, nvGET());
      const nya = nvRows(r)
        .filter(m => nvVeckorMellan(m.giltig_fran, datum) % (m.intervall_veckor || 1) === 0)
        .map(m => ({ pass_mall_id: m.id, kommun_id: m.kommun_id, enhet_id: m.enhet_id, datum,
                     starttid: m.starttid, sluttid: m.sluttid, titel: m.titel, typ: m.typ, faser: m.faser, spar: m.spar }));
      if (nya.length) {
        await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?on_conflict=pass_mall_id,datum`,
          { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' } }, nya);
      }
    }

    // Tar bort pass från och med ett datum som INTE har någon registrerad
    // närvaro. Registrerade pass är historik och står kvar.
    async function nvRensaFramtida(mallIds, fran) {
      if (!mallIds.length) return;
      const inst = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?pass_mall_id=in.(${mallIds.join(',')})&datum=gte.${fran}&select=id`, nvGET()));
      if (!inst.length) return;
      const ids = inst.map(i => i.id);
      const reg = new Set(nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?pass_instans_id=in.(${ids.join(',')})&select=pass_instans_id`, nvGET())).map(x => x.pass_instans_id));
      const bort = ids.filter(id => !reg.has(id));
      if (bort.length) await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?id=in.(${bort.join(',')})`, { method: 'DELETE', headers: serviceHeaders() });
    }

    async function nvAktiva(kommun_id, enhet_id) {
      let url = `${SUPABASE_URL}/rest/v1/user_assignments?select=user_id,name,fas,fas_ny,fas_ny_fran,spar,program_start,program_slut&programstatus=eq.aktiv&kommun_id=eq.${kommun_id}`;
      if (enhet_id != null) url += `&enhet_id=eq.${enhet_id}`;
      return nvRows(await makeRequest(url, nvGET())).filter(u => u.user_id);
    }
    // Ska deltagaren vara med på passet? Programperiod + passets faser och spår.
    // Planerat fasbyte gäller från fas_ny_fran — före det datumet gäller nuvarande fas
    const nvFas = (u, datum) => (u.fas_ny && u.fas_ny_fran && datum >= u.fas_ny_fran) ? u.fas_ny : u.fas;
    const nvSkaDelta = (u, p) =>
      (!u.program_start || u.program_start <= p.datum) && (!u.program_slut || u.program_slut >= p.datum)
      && (!p.faser || !p.faser.length || p.faser.includes(nvFas(u, p.datum)))
      && (!p.spar || !p.spar.length || p.spar.includes(u.spar));

    // ── Temacykel ──
    const TEMA_FALT = ['tema', 'utflykt', 'ordtema', 'halsofokus', 'modul', 'kbt_tema', 'man_em'];
    const TEMA_DELTAGARE = ['tema', 'utflykt', 'ordtema', 'halsofokus', 'modul'];   // kbt_tema och man_em bara för personal
    // Cykelvecka 1–8 för ett datum, räknat från cykelns startmåndag. Före start: null.
    const nvCykelvecka = (start, datum) => (!start || datum < start) ? null : (nvVeckorMellan(start, datum) % 8) + 1;
    async function nvTemaScope(kommun_id, enhet_id) {
      // Enhetens egen cykel går före kommunens
      const lista = enhet_id != null ? [{ kommun_id, enhet_id }, { kommun_id, enhet_id: null }] : [{ kommun_id, enhet_id: null }];
      for (const sc of lista) {
        const c = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/tema_cykel?${nvScopeFilter(sc)}&select=start_datum&limit=1`, nvGET()))[0];
        if (c) return { ...sc, start_datum: c.start_datum };
      }
      return null;
    }
    async function nvTemaFor(kommun_id, enhet_id, datum, forPersonal) {
      const sc = await nvTemaScope(kommun_id, enhet_id);
      if (!sc) return null;
      const v = nvCykelvecka(sc.start_datum, datum);
      if (!v) return null;
      const rad = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/vecka_tema?${nvScopeFilter(sc)}&cykelvecka=eq.${v}&select=*&limit=1`, nvGET()))[0] || {};
      const ut = { cykelvecka: v, testvecka: !!rad.testvecka };
      (forPersonal ? TEMA_FALT : TEMA_DELTAGARE).forEach(k => { if (rad[k]) ut[k] = rad[k]; });
      return ut;
    }

    async function nvHamtaPass(admin, passId) {
      const id = parseInt(passId, 10);
      if (!Number.isFinite(id)) return { fel: 400, msg: 'Ogiltigt pass' };
      const p = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?id=eq.${id}&select=*&limit=1`, nvGET()))[0];
      if (!p) return { fel: 404, msg: 'Passet finns inte' };
      if (!nvIScope(admin, p)) return { fel: 403, msg: 'Passet tillhör en annan verksamhet' };
      return { p };
    }

    // Vilka rader i veckoschemat berörs? 'veckodag' = passets egen dag i
    // serien, 'serie' = alla dagar i serien.
    async function nvMallarFor(admin, omfang, p, serieId) {
      let mallar;
      if (omfang === 'veckodag') {
        if (!p || !p.pass_mall_id) return { fel: 400, msg: 'Passet ingår inte i någon serie' };
        mallar = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?id=eq.${p.pass_mall_id}&select=*`, nvGET()));
      } else {
        let sid = serieId;
        if (!sid && p && p.pass_mall_id) {
          sid = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?id=eq.${p.pass_mall_id}&select=serie_id&limit=1`, nvGET()))[0]?.serie_id;
        }
        if (!sid || !UUID_RE.test(sid)) return { fel: 400, msg: 'Serien hittades inte' };
        mallar = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?serie_id=eq.${sid}&aktiv=eq.true&select=*`, nvGET()));
      }
      if (!mallar.length) return { fel: 404, msg: 'Serien hittades inte' };
      if (mallar.some(m => !nvIScope(admin, m))) return { fel: 403, msg: 'Serien tillhör en annan verksamhet' };
      return { mallar };
    }

    if (action === 'admin_list_serier') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const idag = nvIdag();
      const r = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?${nvScopeFilter(sc)}&aktiv=eq.true&select=*&order=veckodag,starttid`, nvGET()));
      const serier = {};
      r.filter(m => !m.giltig_till || m.giltig_till >= idag).forEach(m => {
        const s = serier[m.serie_id] || (serier[m.serie_id] = {
          serie_id: m.serie_id, titel: m.titel, typ: m.typ, faser: m.faser, spar: m.spar,
          giltig_fran: m.giltig_fran, giltig_till: m.giltig_till, intervall_veckor: m.intervall_veckor, dagar: []
        });
        s.dagar.push({ mall_id: m.id, veckodag: m.veckodag, starttid: nvTid(m.starttid), sluttid: nvTid(m.sluttid), titel: m.titel, typ: m.typ });
      });
      return res.status(200).json({ serier: Object.values(serier) });
    }

    if (action === 'admin_create_serie') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const s = req.body?.serie || {};
      const dagar = [...new Set((Array.isArray(s.veckodagar) ? s.veckodagar : []).map(Number))].filter(d => d >= 1 && d <= 7);
      if (!dagar.length) return res.status(400).json({ error: 'Välj minst en veckodag' });
      const v = nvValidera({ ...s, faser: s.faser || [], spar: s.spar || [] }, true);
      if (v.fel) return res.status(400).json({ error: v.fel });
      const fran = String(s.giltig_fran || nvIdag());
      const till = s.giltig_till ? String(s.giltig_till) : null;
      if (!NV_DAG_RE.test(fran) || (till && !NV_DAG_RE.test(till))) return res.status(400).json({ error: 'Ogiltigt datum' });
      if (till && till < fran) return res.status(400).json({ error: 'Slutdatum kan inte ligga före startdatum' });
      const intervall = Number(s.intervall_veckor) === 2 ? 2 : 1;
      const serie_id = crypto.randomUUID();
      const rader = dagar.map(d => ({ ...v.ut, kommun_id: sc.kommun_id, enhet_id: sc.enhet_id, veckodag: d,
        serie_id, giltig_fran: fran, giltig_till: till, intervall_veckor: intervall, skapad_av: admin.id }));
      const w = await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, rader);
      if (w.status >= 400) {
        console.warn('[admin_create_serie]', w.status, maskPII(w.data));
        return res.status(400).json({ error: 'Kunde inte spara serien' });
      }
      await logAdminAction(admin.id, 'admin_create_serie', { serie_id, dagar });
      return res.status(200).json({ serie_id, dagar: dagar.length });
    }

    if (action === 'admin_list_pass_dag') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const datum = String(req.body?.datum || '');
      if (!NV_DAG_RE.test(datum)) return res.status(400).json({ error: 'Ogiltigt datum' });
      await nvSkapaPass(sc, datum);
      const pass = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?${nvScopeFilter(sc)}&datum=eq.${datum}&select=*&order=starttid`, nvGET()));
      const del = await nvAktiva(sc.kommun_id, sc.enhet_id);
      const ids = pass.map(p => p.id);
      const reg = ids.length ? nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?pass_instans_id=in.(${ids.join(',')})&select=pass_instans_id,status`, nvGET())) : [];
      const tema = await nvTemaFor(sc.kommun_id, sc.enhet_id, datum, true);
      return res.status(200).json({
        datum, tema,
        pass: pass.map(p => {
          const r = reg.filter(x => x.pass_instans_id === p.id);
          return { ...p, starttid: nvTid(p.starttid), sluttid: nvTid(p.sluttid),
                   forvantade: del.filter(u => nvSkaDelta(u, p)).length,
                   registrerade: r.length,
                   narvarande: r.filter(x => x.status === 'narvarande' || x.status === 'sen').length };
        })
      });
    }

    if (action === 'admin_get_pass_narvaro') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const { p, fel, msg } = await nvHamtaPass(admin, req.body?.passId);
      if (fel) return res.status(fel).json({ error: msg });
      const del = await nvAktiva(p.kommun_id, p.enhet_id);
      const reg = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?pass_instans_id=eq.${p.id}&select=user_id,status,kommentar`, nvGET()));
      const regMap = {};
      reg.forEach(r => { regMap[r.user_id] = r; });
      const lista = del.filter(u => nvSkaDelta(u, p) || regMap[u.user_id]).map(u => ({
        user_id: u.user_id, name: u.name, fas: u.fas, spar: u.spar,
        status: regMap[u.user_id]?.status || null, kommentar: regMap[u.user_id]?.kommentar || ''
      }));
      // Den som registrerats men sedan lämnat programmet ska ändå synas
      reg.filter(r => !lista.some(x => x.user_id === r.user_id)).forEach(r => lista.push({
        user_id: r.user_id, name: null, status: r.status, kommentar: r.kommentar || '', ejAktiv: true
      }));
      return res.status(200).json({ pass: { ...p, starttid: nvTid(p.starttid), sluttid: nvTid(p.sluttid) }, deltagare: lista, registrerad: reg.length > 0 });
    }

    if (action === 'admin_save_narvaro') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const { p, fel, msg } = await nvHamtaPass(admin, req.body?.passId);
      if (fel) return res.status(fel).json({ error: msg });
      if (p.installt) return res.status(400).json({ error: 'Passet är inställt' });
      const rader = Array.isArray(req.body?.rader) ? req.body.rader : [];
      if (!rader.length || rader.length > 200) return res.status(400).json({ error: 'Ingen närvaro att spara' });
      // Bara deltagare som hör till passet — eller redan är registrerade på det
      const tillatna = new Set((await nvAktiva(p.kommun_id, p.enhet_id)).filter(u => nvSkaDelta(u, p)).map(u => u.user_id));
      nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?pass_instans_id=eq.${p.id}&select=user_id`, nvGET())).forEach(r => tillatna.add(r.user_id));
      const nu = new Date().toISOString();
      const ut = [];
      for (const r of rader) {
        if (!r || !UUID_RE.test(String(r.user_id || ''))) return res.status(400).json({ error: 'Ogiltig deltagare' });
        if (!tillatna.has(r.user_id)) return res.status(403).json({ error: 'En deltagare hör inte till passet' });
        if (!NV_STATUS.includes(r.status)) return res.status(400).json({ error: 'Ogiltig närvarostatus' });
        const k = r.kommentar == null ? null : (String(r.kommentar).trim().slice(0, 300) || null);
        ut.push({ pass_instans_id: p.id, user_id: r.user_id, status: r.status, kommentar: k, registrerad_av: admin.id, registrerad_at: nu });
      }
      const w = await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?on_conflict=pass_instans_id,user_id`,
        { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'resolution=merge-duplicates,return=minimal' } }, ut);
      if (w.status >= 400) {
        console.warn('[admin_save_narvaro]', w.status, maskPII(w.data));
        return res.status(400).json({ error: 'Kunde inte spara närvaron' });
      }
      await logAdminAction(admin.id, 'admin_save_narvaro', { pass_instans_id: p.id, antal: ut.length });
      return res.status(200).json({ sparade: ut.length });
    }

    // Ställ in (eller återställ) ett pass — eller alla pass i verksamheten
    // den dagen ('dag'), t.ex. en helgdag eller studiedag.
    if (action === 'admin_installa_pass') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const { p, fel, msg } = await nvHamtaPass(admin, req.body?.passId);
      if (fel) return res.status(fel).json({ error: msg });
      const omfang = req.body?.omfang === 'dag' ? 'dag' : 'pass';
      const installt = !!req.body?.installt;
      const kommentar = installt && req.body?.kommentar ? (String(req.body.kommentar).trim().slice(0, 300) || null) : null;
      const url = omfang === 'dag'
        ? `${SUPABASE_URL}/rest/v1/pass_instans?${nvScopeFilter(p)}&datum=eq.${p.datum}`
        : `${SUPABASE_URL}/rest/v1/pass_instans?id=eq.${p.id}`;
      const w = await makeRequest(url, { method: 'PATCH', headers: { ...serviceHeaders(), 'Prefer': 'return=representation' } }, { installt, kommentar });
      if (w.status >= 400) return res.status(400).json({ error: 'Kunde inte ändra passet' });
      await logAdminAction(admin.id, 'admin_installa_pass', { pass_instans_id: p.id, omfang, installt });
      return res.status(200).json({ andrade: nvRows(w).length });
    }

    // Ändra tid, titel, typ eller målgrupp. omfang:
    //   'pass'     — bara det här passet
    //   'veckodag' — passets veckodag i serien, från och med fran_datum
    //   'serie'    — alla dagar i serien, från och med fran_datum
    if (action === 'admin_edit_schema') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const omfang = req.body?.omfang;
      if (!['pass', 'veckodag', 'serie'].includes(omfang)) return res.status(400).json({ error: 'Välj vad ändringen ska gälla' });
      let p = null;
      if (req.body?.passId != null) {
        const h = await nvHamtaPass(admin, req.body.passId);
        if (h.fel) return res.status(h.fel).json({ error: h.msg });
        p = h.p;
      }
      const v = nvValidera(req.body?.andring || {}, false);
      if (v.fel) return res.status(400).json({ error: v.fel });
      if (!Object.keys(v.ut).length) return res.status(200).json({ andrade: 0 });

      if (omfang === 'pass') {
        if (!p) return res.status(400).json({ error: 'Passet saknas' });
        const s = v.ut.starttid || nvTid(p.starttid), e = v.ut.sluttid || nvTid(p.sluttid);
        if (nvMin(e) <= nvMin(s)) return res.status(400).json({ error: 'Sluttiden måste vara efter starttiden' });
        await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?id=eq.${p.id}`, nvPATCH(), v.ut);
        await logAdminAction(admin.id, 'admin_edit_schema', { omfang, pass_instans_id: p.id, falt: Object.keys(v.ut) });
        return res.status(200).json({ andrade: 1 });
      }

      const m = await nvMallarFor(admin, omfang, p, req.body?.serieId);
      if (m.fel) return res.status(m.fel).json({ error: m.msg });
      const fran = String(req.body?.fran_datum || (p ? p.datum : nvIdag()));
      if (!NV_DAG_RE.test(fran)) return res.status(400).json({ error: 'Ogiltigt datum' });
      for (const mall of m.mallar) {
        const s = v.ut.starttid || nvTid(mall.starttid), e = v.ut.sluttid || nvTid(mall.sluttid);
        if (nvMin(e) <= nvMin(s)) return res.status(400).json({ error: 'Sluttiden måste vara efter starttiden' });
      }
      const ids = m.mallar.map(x => x.id).join(',');
      await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?id=in.(${ids})`, nvPATCH(), v.ut);
      // Redan skapade pass från och med datumet följer med, även registrerade:
      // personalen har uttryckligen valt "från och med".
      await makeRequest(`${SUPABASE_URL}/rest/v1/pass_instans?pass_mall_id=in.(${ids})&datum=gte.${fran}`, nvPATCH(), v.ut);
      await logAdminAction(admin.id, 'admin_edit_schema', { omfang, fran, mallar: m.mallar.length, falt: Object.keys(v.ut) });
      return res.status(200).json({ andrade: m.mallar.length });
    }

    // Avsluta en veckodag i serien eller hela serien från och med ett datum.
    if (action === 'admin_avsluta_schema') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const omfang = req.body?.omfang;
      if (!['veckodag', 'serie'].includes(omfang)) return res.status(400).json({ error: 'Välj vad som ska avslutas' });
      let p = null;
      if (req.body?.passId != null) {
        const h = await nvHamtaPass(admin, req.body.passId);
        if (h.fel) return res.status(h.fel).json({ error: h.msg });
        p = h.p;
      }
      const m = await nvMallarFor(admin, omfang, p, req.body?.serieId);
      if (m.fel) return res.status(m.fel).json({ error: m.msg });
      const fran = String(req.body?.fran_datum || (p ? p.datum : nvIdag()));
      if (!NV_DAG_RE.test(fran)) return res.status(400).json({ error: 'Ogiltigt datum' });
      for (const mall of m.mallar) {
        const patch = fran <= mall.giltig_fran ? { aktiv: false } : { giltig_till: nvDagFore(fran) };
        await makeRequest(`${SUPABASE_URL}/rest/v1/pass_mall?id=eq.${mall.id}`, nvPATCH(), patch);
      }
      await nvRensaFramtida(m.mallar.map(x => x.id), fran);
      await logAdminAction(admin.id, 'admin_avsluta_schema', { omfang, fran, mallar: m.mallar.length });
      return res.status(200).json({ avslutade: m.mallar.length });
    }

    // Närvaro per vecka för en deltagare (F1.6). Bara REGISTRERADE pass
    // räknas: ett pass som personalen inte bockat säger ingenting om
    // deltagaren och får inte se ut som frånvaro. 'sen' räknas som närvaro.
    if (action === 'admin_get_deltagare_narvaro') {
      const uid = targetUserId;
      if (!uid || !UUID_RE.test(uid)) return res.status(400).json({ error: 'Ogiltigt deltagar-id' });
      const { admin } = await requireAdmin(res, accessToken, action, { requestedUserId: uid });
      if (!admin) return;
      const r = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?user_id=eq.${encodeURIComponent(uid)}&select=status,pass_instans(datum,starttid,sluttid,installt)`, nvGET()));
      const veckor = {};
      r.forEach(x => {
        const p = x.pass_instans;
        if (!p || p.installt) return;
        const ms = nvMandagMs(p.datum);
        const v = veckor[ms] || (veckor[ms] = { mandag: new Date(ms).toISOString().slice(0, 10), pass: 0, schemaMin: 0, narvaroMin: 0, sen: 0, giltig: 0, ogiltig: 0 });
        const min = nvMin(p.sluttid) - nvMin(p.starttid);
        v.pass++;
        v.schemaMin += min;
        if (x.status === 'narvarande' || x.status === 'sen') v.narvaroMin += min;
        if (x.status === 'sen') v.sen++;
        if (x.status === 'franvarande_giltig') v.giltig++;
        if (x.status === 'franvarande_ogiltig') v.ogiltig++;
      });
      const lista = Object.values(veckor).sort((a, b) => (a.mandag < b.mandag ? 1 : -1)).slice(0, 8)
        .map(v => ({ ...v, procent: v.schemaMin ? Math.round((100 * v.narvaroMin) / v.schemaMin) : null }));
      return res.status(200).json({ veckor: lista });
    }

    if (action === 'admin_get_temacykel') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const c = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/tema_cykel?${nvScopeFilter(sc)}&select=start_datum&limit=1`, nvGET()))[0];
      const rader = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/vecka_tema?${nvScopeFilter(sc)}&select=*&order=cykelvecka`, nvGET()));
      const veckor = [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
        const r = rader.find(x => x.cykelvecka === n) || {};
        const ut = { cykelvecka: n, testvecka: !!r.testvecka };
        TEMA_FALT.forEach(k => { ut[k] = r[k] || ''; });
        return ut;
      });
      return res.status(200).json({ start_datum: c?.start_datum || null, aktuell: nvCykelvecka(c?.start_datum, nvIdag()), veckor });
    }

    if (action === 'admin_save_temacykel_start') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const d = String(req.body?.start_datum || '');
      if (!NV_DAG_RE.test(d)) return res.status(400).json({ error: 'Ogiltigt datum' });
      if (nvVeckodag(d) !== 1) return res.status(400).json({ error: 'Cykeln måste börja på en måndag' });
      const finns = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/tema_cykel?${nvScopeFilter(sc)}&select=id&limit=1`, nvGET()))[0];
      const data = { start_datum: d, uppdaterad_av: admin.id, uppdaterad_at: new Date().toISOString() };
      const w = finns
        ? await makeRequest(`${SUPABASE_URL}/rest/v1/tema_cykel?id=eq.${finns.id}`, nvPATCH(), data)
        : await makeRequest(`${SUPABASE_URL}/rest/v1/tema_cykel`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, { ...data, kommun_id: sc.kommun_id, enhet_id: sc.enhet_id });
      if (w.status >= 400) return res.status(400).json({ error: 'Kunde inte spara startdatum' });
      await logAdminAction(admin.id, 'admin_save_temacykel_start', { start_datum: d });
      return res.status(200).json({ start_datum: d, aktuell: nvCykelvecka(d, nvIdag()) });
    }

    if (action === 'admin_save_vecka_tema') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      const sc = await nvScope(admin, req.body);
      if (sc.fel) return res.status(400).json({ error: sc.fel });
      const n = parseInt(req.body?.cykelvecka, 10);
      if (!(n >= 1 && n <= 8)) return res.status(400).json({ error: 'Cykelveckan måste vara 1–8' });
      const v = req.body?.vecka || {};
      const data = { testvecka: !!v.testvecka, uppdaterad_av: admin.id, uppdaterad_at: new Date().toISOString() };
      for (const k of TEMA_FALT) {
        const t = v[k] == null ? '' : String(v[k]).trim();
        if (t.length > 120) return res.status(400).json({ error: 'Max 120 tecken per fält' });
        data[k] = t || null;
      }
      const finns = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/vecka_tema?${nvScopeFilter(sc)}&cykelvecka=eq.${n}&select=id&limit=1`, nvGET()))[0];
      const w = finns
        ? await makeRequest(`${SUPABASE_URL}/rest/v1/vecka_tema?id=eq.${finns.id}`, nvPATCH(), data)
        : await makeRequest(`${SUPABASE_URL}/rest/v1/vecka_tema`, { method: 'POST', headers: { ...serviceHeaders(), 'Prefer': 'return=minimal' } }, { ...data, kommun_id: sc.kommun_id, enhet_id: sc.enhet_id, cykelvecka: n });
      if (w.status >= 400) {
        console.warn('[admin_save_vecka_tema]', w.status, maskPII(w.data));
        return res.status(400).json({ error: 'Kunde inte spara veckan' });
      }
      await logAdminAction(admin.id, 'admin_save_vecka_tema', { cykelvecka: n });
      return res.status(200).json({ ok: true });
    }

    // Deltagarens egen vecka: passen hen ska vara på, egen närvaro per pass
    // och närvaro per vecka. Bara för deltagare med programstatus Aktiv;
    // övriga får iProgram:false och ser ingenting nytt i appen.
    if (action === 'my_program') {
      const jwt = await verifyJwtUser(accessToken);
      if (!jwt) return res.status(401).json({ error: 'invalid_token' });
      const ua = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/user_assignments?user_id=eq.${jwt.id}&select=*&limit=1`, nvGET()))[0];
      const u = await befordraFas(ua);
      if (!u || u.programstatus !== 'aktiv' || !u.kommun_id) return res.status(200).json({ iProgram: false });

      const idag = nvIdag();
      let fran = String(req.body?.fran || idag);
      if (!NV_DAG_RE.test(fran)) return res.status(400).json({ error: 'Ogiltigt datum' });
      const m = new Date(nvMandagMs(fran));
      fran = m.toISOString().slice(0, 10);
      const dagar = [...Array(7)].map((_, i) => { const t = new Date(m); t.setUTCDate(t.getUTCDate() + i); return t.toISOString().slice(0, 10); });
      const till = dagar[6];

      // Pass kan ligga på kommunnivå eller på deltagarens enhet
      const scopes = [{ kommun_id: u.kommun_id, enhet_id: null }];
      if (u.enhet_id != null) scopes.push({ kommun_id: u.kommun_id, enhet_id: u.enhet_id });
      await Promise.all(scopes.flatMap(sc => dagar.map(d => nvSkapaPass(sc, d))));
      const enhetVillkor = u.enhet_id != null ? `or=(enhet_id.is.null,enhet_id.eq.${u.enhet_id})` : 'enhet_id=is.null';
      const pass = nvRows(await makeRequest(
        `${SUPABASE_URL}/rest/v1/pass_instans?kommun_id=eq.${u.kommun_id}&${enhetVillkor}&datum=gte.${fran}&datum=lte.${till}&select=*&order=datum,starttid`, nvGET()))
        .filter(p => nvSkaDelta(u, p));
      const ids = pass.map(p => p.id);
      const egen = ids.length ? nvRows(await makeRequest(
        `${SUPABASE_URL}/rest/v1/narvaro?user_id=eq.${jwt.id}&pass_instans_id=in.(${ids.join(',')})&select=pass_instans_id,status`, nvGET())) : [];
      const egenMap = {};
      egen.forEach(x => { egenMap[x.pass_instans_id] = x.status; });

      // Närvaro per vecka, senaste sex veckorna med registrerade pass
      const alla = nvRows(await makeRequest(`${SUPABASE_URL}/rest/v1/narvaro?user_id=eq.${jwt.id}&select=status,pass_instans(datum,starttid,sluttid,installt)`, nvGET()));
      const veckor = {};
      alla.forEach(x => {
        const p = x.pass_instans;
        if (!p || p.installt) return;
        const ms = nvMandagMs(p.datum);
        const v = veckor[ms] || (veckor[ms] = { mandag: new Date(ms).toISOString().slice(0, 10), schemaMin: 0, narvaroMin: 0 });
        const min = nvMin(p.sluttid) - nvMin(p.starttid);
        v.schemaMin += min;
        if (x.status === 'narvarande' || x.status === 'sen') v.narvaroMin += min;
      });

      return res.status(200).json({
        iProgram: true,
        fas: nvFas(u, idag), spar: u.spar,
        fasNy: u.fas_ny || null, fasNyFran: u.fas_ny_fran || null,
        fran, till, idag,
        tema: await nvTemaFor(u.kommun_id, u.enhet_id, fran, false),
        dagar: dagar.map(d => ({
          datum: d,
          pass: pass.filter(p => p.datum === d).map(p => ({
            id: p.id, titel: p.titel, typ: p.typ, starttid: nvTid(p.starttid), sluttid: nvTid(p.sluttid),
            installt: p.installt, kommentar: p.installt ? p.kommentar : null, narvaro: egenMap[p.id] || null
          }))
        })),
        veckor: Object.values(veckor).sort((a, b) => (a.mandag < b.mandag ? 1 : -1)).slice(0, 6)
          .map(v => ({ mandag: v.mandag, procent: v.schemaMin ? Math.round((100 * v.narvaroMin) / v.schemaMin) : null }))
      });
    }

    if (action === 'admin_get_kommuner') {
      const { admin } = await requireAdmin(res, accessToken, action, {});
      if (!admin) return;
      let url = `${SUPABASE_URL}/rest/v1/kommuner?select=id,name&order=name`;
      if (admin.role !== 'superadmin' && admin.kommun_id) {
        url += `&id=eq.${admin.kommun_id}`;
      }
      const result = await makeRequest(url, { method: 'GET', headers: serviceHeaders() });
      return res.status(200).json({ data: Array.isArray(result.data) ? result.data : [] });
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

      // ── KOSTNADSTAK: max antal intervjuer per användare och dygn ──
      // Räknas från svensk midnatt. Queryn är RLS-skopad (användarens egen
      // token, inget user_id-filter från bodyn) → går inte att kringgå
      // genom att skicka annat userId. Frontend visar samma gräns.
      const DAILY_INTERVIEW_LIMIT = 3;
      const nowD = new Date();
      const hms = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit',
        second: '2-digit', hourCycle: 'h23'
      }).format(nowD).split(':').map(Number);
      const midnightUTC = new Date(nowD.getTime() - ((hms[0] * 3600 + hms[1] * 60 + hms[2]) * 1000)).toISOString();
      const todayRes = await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_sessions?started_at=gte.${encodeURIComponent(midnightUTC)}&select=id&limit=10`,
        { method: 'GET', headers: authHeaders(accessToken) }
      );
      const todayCount = Array.isArray(todayRes.data) ? todayRes.data.length : 0;
      if (todayCount >= DAILY_INTERVIEW_LIMIT) {
        return res.status(429).json({
          error: 'Du har nått dagens gräns på ' + DAILY_INTERVIEW_LIMIT + ' intervjuer. Kom tillbaka imorgon — då är räknaren nollställd!',
          code: 'daily_limit'
        });
      }
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
      if (result.status >= 400) { console.warn('[interview_session] DB-fel:', result.status, maskPII(result.data)); return res.status(result.status).json({ error: 'Kunde inte skapa session' }); }
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
      if (result.status >= 400) { console.warn('[interview_message] DB-fel:', result.status, maskPII(result.data)); return res.status(result.status).json({ error: 'Kunde inte spara meddelande' }); }
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ message: rows[0] || null });
    }

    if (action === 'complete_interview_session') {
      // Avsluta session och spara feedback
      // Förväntar: accessToken, sessionId, durationSeconds?, overallFeedback?, userRating?, userNotes?, status?
      const { sessionId, durationSeconds, overallFeedback, userRating, userNotes, status: sessStatus } = req.body || {};
      if (!sessionId) return res.status(400).json({ error: 'sessionId krävs' });
      // Whitelist av status + numerisk duration — inga godtyckliga strängar in i DB
      const safeStatus = ['completed', 'abandoned'].includes(sessStatus) ? sessStatus : 'completed';
      const safeDuration = Number.isFinite(parseInt(durationSeconds, 10)) ? Math.max(0, parseInt(durationSeconds, 10)) : null;
      const updates = {
        status: safeStatus,
        completed_at: new Date().toISOString(),
        duration_seconds: safeDuration,
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
      if (result.status >= 400) { console.warn('[saved_question] DB-fel:', result.status, maskPII(result.data)); return res.status(result.status).json({ error: 'Kunde inte spara fråga' }); }
      const rows = Array.isArray(result.data) ? result.data : [];
      return res.status(201).json({ savedQuestion: rows[0] || null });
    }

    if (action === 'list_interview_sessions') {
      // Hämta intervjuhistorik för användaren
      // Förväntar: accessToken, userId, limit?
      // Sanera limit — går rakt in i URL:en (samma mönster som övriga actions)
      const listLimit = Math.min(Math.max(parseInt((req.body && req.body.limit), 10) || 20, 1), 50);
      const result = await makeRequest(
        `${SUPABASE_URL}/rest/v1/interview_sessions?user_id=eq.${userId}&select=*&order=started_at.desc&limit=${listLimit}`,
        { method: 'GET', headers: authHeaders(accessToken) }
      );
      return res.status(200).json({ sessions: Array.isArray(result.data) ? result.data : [] });
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });

  } catch (err) {
    Sentry.captureException(err);
    console.error('Supabase API error:', maskPII(err.message));
    return res.status(500).json({ error: 'Ett serverfel inträffade' });
  }
}
