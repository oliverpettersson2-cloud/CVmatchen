// Delade helpers för marketing-agentens endpoints.
// Använder fetch + service_key mot Supabase REST (PostgREST).

import fs from 'fs';
import path from 'path';

export const MODEL = 'claude-sonnet-4-6';
export const AGENT_VERSION = '0.1.0-dryrun';

export function requireAgentAuth(req) {
  const expected = process.env.MARKETING_AGENT_TOKEN;
  if (!expected) return { ok: false, code: 500, error: 'MARKETING_AGENT_TOKEN saknas' };
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (got !== expected) return { ok: false, code: 401, error: 'unauthorized' };
  return { ok: true };
}

export function requireCronAuth(req) {
  // Vercel Cron sätter denna header automatiskt om CRON_SECRET är satt
  const expected = process.env.CRON_SECRET;
  if (!expected) return { ok: false, code: 500, error: 'CRON_SECRET saknas' };
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (got !== expected) return { ok: false, code: 401, error: 'unauthorized' };
  return { ok: true };
}

function sbHeaders() {
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_KEY saknas');
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

export async function sbInsert(table, rows) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: sbHeaders(),
    body: JSON.stringify(rows),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Supabase insert ${table}: ${JSON.stringify(data)}`);
  return data;
}

export async function sbSelect(table, query = '') {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
  const res = await fetch(url, { headers: sbHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(`Supabase select ${table}: ${JSON.stringify(data)}`);
  return data;
}

export async function sbUpdate(table, query, patch) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: sbHeaders(),
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Supabase update ${table}: ${JSON.stringify(data)}`);
  return data;
}

export function readAgentFile(relPath) {
  const root = process.cwd();
  return fs.readFileSync(path.join(root, 'agent', relPath), 'utf8');
}

export async function callClaude({ system, user, maxTokens = 2048 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY saknas');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: [
        // System-promptens första del cachas — playbook+instruktion ändras sällan.
        { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: user }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Anthropic: ${JSON.stringify(data)}`);
  const text = (data.content || []).map(c => c.text || '').join('');
  return { text, usage: data.usage };
}

export function extractJson(text) {
  // Plockar första JSON-blocket, antingen i ```json ... ``` eller raw.
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Inget JSON-objekt i svaret');
  return JSON.parse(raw.slice(start, end + 1));
}

// Deterministisk fake-metric per post, så samma post alltid ger samma siffror.
// Seedat på post_id så loopen blir reproducerbar i dry-run-läge.
export function fakeMetricsFor(postId) {
  let h = 0;
  for (let i = 0; i < postId.length; i++) h = (h * 31 + postId.charCodeAt(i)) >>> 0;
  const rand = (mod) => (h = (h * 1103515245 + 12345) >>> 0) % mod;
  const impressions = 200 + rand(1500);
  const clicks = Math.floor(impressions * (0.005 + (rand(50) / 1000))); // 0.5–5% CTR
  const signups = Math.floor(clicks * (rand(30) / 100));                // 0–30% conv
  return { impressions, clicks, signups };
}
