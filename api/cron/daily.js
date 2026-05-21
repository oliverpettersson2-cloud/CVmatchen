// GET /api/cron/daily — Vercel Cron entrypoint.
// Kör i ordning: measure (gårdagens posts) → learn (om nog data) → plan (idag) → publish (dry-run).
// Auth: Vercel Cron skickar "Authorization: Bearer <CRON_SECRET>".

import * as Sentry from '@sentry/node';
import {
  requireCronAuth, sbInsert, sbSelect, sbUpdate,
  readAgentFile, callClaude, extractJson, fakeMetricsFor,
} from '../marketing/_lib.js';
import crypto from 'crypto';

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

// Återanvänder samma logik som endpoints men inline för att slippa http-anrop till sig själv.
async function measure() {
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
  const posts = await sbSelect(
    'marketing_posts',
    `select=id&status=in.(published,published_dryrun)&published_at=gte.${since}`
  );
  if (!posts.length) return { measured: 0 };
  const ids = posts.map(p => p.id);
  const existing = await sbSelect('marketing_metrics', `select=post_id&post_id=in.(${ids.join(',')})`);
  const have = new Set(existing.map(m => m.post_id));
  const toInsert = posts.filter(p => !have.has(p.id)).map(p => ({
    post_id: p.id, source: 'dryrun', ...fakeMetricsFor(p.id),
  }));
  if (!toInsert.length) return { measured: 0 };
  const inserted = await sbInsert('marketing_metrics', toInsert);
  return { measured: inserted.length };
}

async function learn() {
  const current = await sbSelect('marketing_playbook', 'select=version,content_md&order=version.desc&limit=1');
  const currentVersion = current[0]?.version ?? 0;
  const playbook = current[0]?.content_md || readAgentFile('playbook.md');

  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
  const posts = await sbSelect(
    'marketing_posts',
    `select=id,label,hypothesis,content&status=in.(published,published_dryrun)&published_at=gte.${since}&order=published_at.asc`
  );
  if (posts.length < 3) return { skipped: true, reason: `för få posts (${posts.length})`, version: currentVersion };

  const ids = posts.map(p => p.id);
  const metrics = await sbSelect('marketing_metrics', `select=post_id,impressions,clicks,ctr,signups&post_id=in.(${ids.join(',')})`);
  const byPost = Object.fromEntries(metrics.map(m => [m.post_id, m]));
  const postsBlock = posts.map(p => {
    const m = byPost[p.id] || {};
    return `### ${p.id} [${p.label}]\nhyp: ${p.hypothesis || '-'}\nimpr=${m.impressions ?? '?'} clicks=${m.clicks ?? '?'} ctr=${m.ctr ?? '?'} signups=${m.signups ?? '?'}\n${p.content}`;
  }).join('\n\n');

  const { text } = await callClaude({
    system: readAgentFile('prompts/learn.md'),
    user: `# PLAYBOOK\n${playbook}\n\n# POSTS_AND_METRICS\n${postsBlock}`,
    maxTokens: 3000,
  });
  const parsed = extractJson(text);
  if (!parsed.new_playbook_md) return { skipped: true, reason: 'no playbook returned' };

  const inserted = await sbInsert('marketing_playbook', [{
    version: currentVersion + 1,
    content_md: parsed.new_playbook_md,
    summary: parsed.summary || null,
    based_on_posts: ids,
  }]);
  return { version: inserted[0].version, summary: parsed.summary };
}

async function plan() {
  const dbPlaybook = await sbSelect('marketing_playbook', 'select=content_md&order=version.desc&limit=1');
  const playbook = dbPlaybook[0]?.content_md || readAgentFile('playbook.md');

  const variantGroup = crypto.randomUUID();
  const campaignId = `cron-${new Date().toISOString().slice(0, 10)}-${variantGroup.slice(0, 8)}`;

  const { text } = await callClaude({
    system: readAgentFile('prompts/plan.md'),
    user: `# PLAYBOOK\n${playbook}\n\n# RECENT\n(se senaste loop)\n\n# CAMPAIGN_ID\n${campaignId}`,
    maxTokens: 2048,
  });
  const parsed = extractJson(text);
  const rows = (parsed.variants || []).map(v => ({
    variant_group: variantGroup,
    label: String(v.label || '?').slice(0, 4),
    channel: 'linkedin',
    content: String(v.content || ''),
    hypothesis: String(v.hypothesis || '').slice(0, 500),
    status: 'draft',
    utm_campaign: campaignId,
  }));
  if (!rows.length) return { variant_group: variantGroup, variants: 0 };
  const inserted = await sbInsert('marketing_posts', rows);
  return { variant_group: variantGroup, variants: inserted.length };
}

async function publishDryRun(variantGroup) {
  if (!variantGroup) return { published: 0 };
  const updated = await sbUpdate(
    'marketing_posts',
    `variant_group=eq.${variantGroup}&status=eq.draft`,
    { status: 'published_dryrun', published_at: new Date().toISOString() }
  );
  return { published: updated.length };
}

export default async function handler(req, res) {
  const auth = requireCronAuth(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  const report = { started_at: new Date().toISOString(), steps: {} };
  try {
    report.steps.measure = await measure();
    report.steps.learn   = await learn();
    const planned = await plan();
    report.steps.plan    = planned;
    report.steps.publish = await publishDryRun(planned.variant_group);
    report.ok = true;
  } catch (e) {
    Sentry.captureException(e);
    report.ok = false;
    report.error = e.message;
  }
  report.finished_at = new Date().toISOString();
  return res.status(report.ok ? 200 : 500).json(report);
}
