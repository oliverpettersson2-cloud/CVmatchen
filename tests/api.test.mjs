// ════════════════════════════════════════════════════════════════
// tests/api.test.js — smoke tests för Vercel-funktionerna
// ════════════════════════════════════════════════════════════════
// Kör med: npm test
// Verifierar att handlers kan importeras, avvisar fel HTTP-metoder,
// och hanterar saknad input utan att krascha. Inga riktiga API-anrop
// till Anthropic/Supabase görs.
// ════════════════════════════════════════════════════════════════
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Stub miljövariabler så handlers inte 500:ar på saknad config
process.env.ANTHROPIC_API_KEY ||= 'sk-test-stub';
process.env.SUPABASE_URL ||= 'https://stub.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'stub-service-role';
process.env.MICROSOFT_CLIENT_SECRET ||= 'stub-secret';

// Minimal mock av Vercel res/req
function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
    setHeader(k, v) { this.headers[k] = v; return this; },
    end(payload) { this.body = payload ?? this.body; return this; }
  };
  return res;
}
function mockReq(method, body, headers = {}) {
  return { method, body, headers, socket: { remoteAddress: '127.0.0.1' } };
}

test('api/chat.js — exists och avvisar GET med 405', async () => {
  const mod = await import('../api/chat.js');
  assert.equal(typeof mod.default, 'function', 'default export måste vara handler-funktion');
  const res = mockRes();
  await mod.default(mockReq('GET'), res);
  assert.equal(res.statusCode, 405, 'GET ska returnera 405 Method Not Allowed');
});

test('api/chat.js — POST utan body får INTE returnera 200', async () => {
  const mod = await import('../api/chat.js');
  const res = mockRes();
  try { await mod.default(mockReq('POST', null), res); } catch(e) {}
  assert.notEqual(res.statusCode, 200, 'tom body får aldrig returnera 200 OK');
});

test('api/supabase.js — exists och POST utan action får INTE returnera 200', async () => {
  const mod = await import('../api/supabase.js');
  assert.equal(typeof mod.default, 'function');
  const res = mockRes();
  try { await mod.default(mockReq('POST', {}), res); } catch(e) {}
  assert.notEqual(res.statusCode, 200);
});

test('api/supabase.js — admin_list_users utan token får INTE returnera 200', async () => {
  // Säkerhetsegenskapen: admin_*-actions får ALDRIG läcka data utan giltig token.
  // 401/403 är att föredra; 400/500 är mindre snyggt men säkerhetsmässigt OK.
  const mod = await import('../api/supabase.js');
  const res = mockRes();
  try { await mod.default(mockReq('POST', { action: 'admin_list_users' }), res); } catch(e) {}
  assert.notEqual(res.statusCode, 200,
    `admin_list_users utan token får ALDRIG returnera 200 (fick ${res.statusCode})`);
});

test('api/pdf.js — exists', async () => {
  const mod = await import('../api/pdf.js');
  assert.equal(typeof mod.default, 'function');
});
