// POST /api/marketing/plan
// Genererar dagens 3 post-varianter via Claude och sparar som draft.
// Headers: Authorization: Bearer <MARKETING_AGENT_TOKEN>

import * as Sentry from '@sentry/node';
import crypto from 'crypto';
import {
  requireAgentAuth, sbInsert, sbSelect, readAgentFile, callClaude, extractJson,
} from './_lib.js';

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = requireAgentAuth(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  try {
    // 1. Senaste playbook (fallback till seed-fil om DB är tom)
    const dbPlaybook = await sbSelect(
      'marketing_playbook',
      'select=content_md,version&order=version.desc&limit=1'
    );
    const playbook = dbPlaybook[0]?.content_md || readAgentFile('playbook.md');

    // 2. Senaste 14 dgr posts + metrics (för kontext till Claude)
    const recentPosts = await sbSelect(
      'marketing_posts',
      'select=id,label,hypothesis,content,published_at&status=in.(published,published_dryrun)&order=published_at.desc&limit=20'
    );
    let recentBlock = 'Inga publicerade posts än.';
    if (recentPosts.length) {
      const ids = recentPosts.map(p => p.id);
      const metrics = await sbSelect(
        'marketing_metrics',
        `select=post_id,impressions,clicks,ctr,signups&post_id=in.(${ids.join(',')})`
      );
      const byPost = Object.fromEntries(metrics.map(m => [m.post_id, m]));
      recentBlock = recentPosts.map(p => {
        const m = byPost[p.id] || {};
        return `- [${p.label}] hyp: ${p.hypothesis || '-'} | impr=${m.impressions ?? '?'} clicks=${m.clicks ?? '?'} ctr=${m.ctr ?? '?'} signups=${m.signups ?? '?'}\n  ${p.content.slice(0, 160).replace(/\n/g, ' ')}`;
      }).join('\n');
    }

    // 3. Claude
    const system = readAgentFile('prompts/plan.md');
    const variantGroup = crypto.randomUUID();
    const campaignId = `mvp-${new Date().toISOString().slice(0, 10)}-${variantGroup.slice(0, 8)}`;
    const user = [
      `# PLAYBOOK\n${playbook}`,
      `# RECENT\n${recentBlock}`,
      `# CAMPAIGN_ID\n${campaignId}`,
    ].join('\n\n');

    const { text, usage } = await callClaude({ system, user, maxTokens: 2048 });
    const parsed = extractJson(text);

    if (!Array.isArray(parsed.variants) || parsed.variants.length === 0) {
      return res.status(502).json({ error: 'Claude returnerade inga varianter', text });
    }

    // 4. Spara som draft
    const rows = parsed.variants.map(v => ({
      variant_group: variantGroup,
      label: String(v.label || '').slice(0, 4) || '?',
      channel: 'linkedin',
      content: String(v.content || ''),
      hypothesis: String(v.hypothesis || '').slice(0, 500),
      status: 'draft',
      utm_campaign: campaignId,
    }));
    const inserted = await sbInsert('marketing_posts', rows);

    return res.status(200).json({
      variant_group: variantGroup,
      campaign_id: campaignId,
      variants: inserted,
      usage,
    });
  } catch (e) {
    Sentry.captureException(e);
    console.error('[marketing/plan]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
