// ════════════════════════════════════════════════════════════════
// tests/oauth.test.mjs — Microsoft OAuth-flow end-to-end (mockad)
// ════════════════════════════════════════════════════════════════
// Testar att start-endpoint redirectar korrekt och att callback hanterar
// happy path + alla felfall (state-mismatch, unauthorized email, missing
// code, token exchange fail) UTAN att kontakta riktiga Microsoft/Supabase.
//
// Mockar global fetch så vi kan kontrollera Microsoft- och Supabase-svar.
// ════════════════════════════════════════════════════════════════
import assert from 'node:assert/strict';
import { test, beforeEach, afterEach } from 'node:test';

process.env.MICROSOFT_CLIENT_ID ||= 'test-client-id';
process.env.MICROSOFT_CLIENT_SECRET ||= 'test-secret-very-long-string';
process.env.MICROSOFT_TENANT_ID ||= 'common';
process.env.SUPABASE_URL ||= 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY ||= 'service-stub';

function mockRes() {
  const res = {
    statusCode: 200, headers: {}, body: null, _setCookies: [],
    status(c) { this.statusCode = c; return this; },
    setHeader(k, v) {
      if (k.toLowerCase() === 'set-cookie') this._setCookies.push(v);
      this.headers[k.toLowerCase()] = v; return this;
    },
    end(b) { this.body = b ?? this.body; return this; },
    json(o) { this.body = o; return this; }
  };
  return res;
}
function mockReq(method, query = {}, headers = {}) {
  return {
    method, query,
    headers: Object.assign({
      host: 'cvmatchen.se', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'cvmatchen.se'
    }, headers)
  };
}

let originalFetch;
beforeEach(() => { originalFetch = global.fetch; });
afterEach(() => { global.fetch = originalFetch; });

// ──────────────────────────────────────────────────
test('OAuth start — GET redirectar till login.microsoftonline.com med rätt params', async () => {
  const mod = await import('../api/v1/auth/microsoft.js');
  const res = mockRes();
  await mod.default(mockReq('GET'), res);
  assert.equal(res.statusCode, 302, 'måste vara 302-redirect');
  const loc = res.headers['location'];
  assert.ok(loc.startsWith('https://login.microsoftonline.com/'), 'redirect till Microsoft');
  assert.ok(loc.includes('client_id=test-client-id'), 'client_id i URL');
  assert.ok(loc.includes('response_type=code'), 'response_type=code');
  assert.ok(loc.includes('redirect_uri=https%3A%2F%2Fcvmatchen.se%2Fapi%2Fv1%2Fauth%2Fmicrosoft%2Fcallback'),
    'absolut redirect_uri byggd från host');
  assert.ok(loc.includes('state='), 'state-param finns (CSRF-skydd)');
  // State-cookie satt med HttpOnly + Secure
  const cookie = res._setCookies[0] || '';
  assert.ok(cookie.includes('ms_oauth_state='));
  assert.ok(cookie.includes('HttpOnly'));
  assert.ok(cookie.includes('Secure'));
  assert.ok(cookie.includes('SameSite=Lax'));
});

test('OAuth start — POST avvisas med 405', async () => {
  const mod = await import('../api/v1/auth/microsoft.js');
  const res = mockRes();
  await mod.default(mockReq('POST'), res);
  assert.equal(res.statusCode, 405);
});

test('OAuth start — utan MICROSOFT_CLIENT_ID returnerar 500', async () => {
  const saved = process.env.MICROSOFT_CLIENT_ID;
  delete process.env.MICROSOFT_CLIENT_ID;
  // re-importera modulen för att läsa ny env (Node cachar — använd query-import)
  const mod = await import('../api/v1/auth/microsoft.js?v=' + Date.now());
  const res = mockRes();
  await mod.default(mockReq('GET'), res);
  assert.equal(res.statusCode, 500);
  process.env.MICROSOFT_CLIENT_ID = saved;
});

// ──────────────────────────────────────────────────
test('OAuth callback — utan code redirectar med ms_error=missing_code', async () => {
  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET', { state: 'whatever' }), res);
  assert.equal(res.statusCode, 302);
  assert.ok(res.headers['location'].includes('ms_error=missing_code'));
});

test('OAuth callback — state-mismatch redirectar med invalid_state', async () => {
  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET',
    { code: 'abc', state: 'attacker-state' },
    { cookie: 'ms_oauth_state=real-state' }), res);
  assert.equal(res.statusCode, 302);
  assert.ok(res.headers['location'].includes('ms_error=invalid_state'),
    'CSRF-skydd måste blockera mismatch');
});

test('OAuth callback — Microsoft fel "access_denied" → cancelled', async () => {
  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET',
    { error: 'access_denied', error_description: 'User cancelled' }), res);
  assert.equal(res.statusCode, 302);
  assert.ok(res.headers['location'].includes('ms_error=cancelled'));
});

test('OAuth callback — happy path: email i allowlist → 302 till /admin med token', async () => {
  // Mock Microsoft token-exchange + Graph + Supabase admin-lookup
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('oauth2/v2.0/token')) {
      return new Response(JSON.stringify({ access_token: 'ms-access-stub', token_type: 'Bearer' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('graph.microsoft.com/v1.0/me')) {
      return new Response(JSON.stringify({
        mail: 'oliver.handlaggare@helsingborg.se', displayName: 'Oliver KA'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('/rest/v1/admins')) {
      return new Response(JSON.stringify([
        { id: 'admin-uuid-1', name: 'Oliver KA', email: 'oliver.handlaggare@helsingborg.se', role: 'handlaggare' }
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('/rest/v1/admin_activity_log')) {
      return new Response('', { status: 201 });
    }
    throw new Error('Otestad fetch: ' + u);
  };

  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET',
    { code: 'real-code', state: 'good-state' },
    { cookie: 'ms_oauth_state=good-state' }), res);

  assert.equal(res.statusCode, 302, 'happy path → 302');
  const loc = res.headers['location'];
  assert.ok(loc.includes('/admin?ms_token='), 'redirect till /admin med token');
  // Token-format = base64url(payload).base64url(sig)
  const tokenParam = new URL(loc).searchParams.get('ms_token');
  assert.ok(tokenParam && tokenParam.split('.').length === 2,
    'session-token har payload.signature-format');
});

test('OAuth callback — email INTE i allowlist → ms_error=unauthorized', async () => {
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes('oauth2/v2.0/token')) {
      return new Response(JSON.stringify({ access_token: 'stub' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('graph.microsoft.com/v1.0/me')) {
      return new Response(JSON.stringify({
        mail: 'random.person@gmail.com', displayName: 'Random Person'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('/rest/v1/admins')) {
      // Tom array = email finns inte i allowlist
      return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    throw new Error('Otestad fetch: ' + u);
  };

  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET',
    { code: 'c', state: 's' }, { cookie: 'ms_oauth_state=s' }), res);

  assert.equal(res.statusCode, 302);
  const loc = res.headers['location'];
  assert.ok(loc.includes('ms_error=unauthorized'), 'okänd email blockeras');
  assert.ok(loc.includes('ms_info=random.person'), 'email skickas med så användaren vet vilken som inte funkar');
});

test('OAuth callback — token-exchange fail → token_exchange_failed', async () => {
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes('oauth2/v2.0/token')) {
      return new Response(JSON.stringify({ error: 'invalid_grant' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    throw new Error('Otestad fetch: ' + u);
  };
  const mod = await import('../api/v1/auth/microsoft/callback.js');
  const res = mockRes();
  await mod.default(mockReq('GET',
    { code: 'bad', state: 's' }, { cookie: 'ms_oauth_state=s' }), res);
  assert.equal(res.statusCode, 302);
  assert.ok(res.headers['location'].includes('ms_error=token_exchange_failed'));
});
