// POST /api/marketing/learn
// Läser senaste 14 dgrs posts + metrics, kallar Claude för retrospektiv,
// och skriver en ny playbook-version till DB.
// Headers: Authorization: Bearer <MARKETING_AGENT_TOKEN>

import * as Sentry from '@sentry/node';
import {
  requireAgentAuth, sbSelect, sbInsert, readAgentFile, callClaude, extractJson,
} from './_lib.js';

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = requireAgentAuth(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  try {
    const current = await sbSelect(
      'marketing_playbook',
      'select=version,content_md&order=version.desc&limit=1'
    );
    const currentVersion = current[0]?.version ?? 0;
    const playbook = current[0]?.content_md || readAgentFile('playbook.md');

    const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
    const posts = await sbSelect(
      'marketing_posts',
      `select=id,label,hypothesis,content,published_at&status=in.(published,published_dryrun)&published_at=gte.${since}&order=published_at.asc`
    );

    if (posts.length < 3) {
      return res.status(200).json({
        skipped: true,
        reason: `För få posts (${posts.length}) för att lära`,
        version: currentVersion,
      });
    }

    const ids = posts.map(p => p.id);
    const metrics = await sbSelect(
      'marketing_metrics',
      `select=post_id,impressions,clicks,ctr,signups&post_id=in.(${ids.join(',')})`
    );
    const byPost = Object.fromEntries(metrics.map(m => [m.post_id, m]));

    const postsBlock = posts.map(p => {
      const m = byPost[p.id] || {};
      return `### post ${p.id} [${p.label}]
hypotes: ${p.hypothesis || '-'}
metrics: impressions=${m.impressions ?? '?'} clicks=${m.clicks ?? '?'} ctr=${m.ctr ?? '?'} signups=${m.signups ?? '?'}
innehåll:
${p.content}
`;
    }).join('\n');

    const system = readAgentFile('prompts/learn.md');
    const user = `# PLAYBOOK\n${playbook}\n\n# POSTS_AND_METRICS\n${postsBlock}`;
    const { text, usage } = await callClaude({ system, user, maxTokens: 3000 });
    const parsed = extractJson(text);

    if (!parsed.new_playbook_md) {
      return res.status(502).json({ error: 'Claude returnerade ingen ny playbook', text });
    }

    const inserted = await sbInsert('marketing_playbook', [{
      version: currentVersion + 1,
      content_md: parsed.new_playbook_md,
      summary: parsed.summary || null,
      based_on_posts: ids,
    }]);

    return res.status(200).json({
      version: inserted[0].version,
      summary: parsed.summary,
      confident_findings: parsed.confident_findings || [],
      low_confidence_observations: parsed.low_confidence_observations || [],
      based_on_count: ids.length,
      usage,
    });
  } catch (e) {
    Sentry.captureException(e);
    console.error('[marketing/learn]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
