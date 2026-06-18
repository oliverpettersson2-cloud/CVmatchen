// POST /api/marketing/measure
// MVP: DRY-RUN — genererar deterministiska fake-metrics för alla posts
// som publicerats senaste 24h och som inte redan har en metric-rad.
// Headers: Authorization: Bearer <MARKETING_AGENT_TOKEN>

import * as Sentry from '@sentry/node';
import { requireAgentAuth, sbSelect, sbInsert, fakeMetricsFor } from './_lib.js';

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = requireAgentAuth(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  try {
    const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
    const posts = await sbSelect(
      'marketing_posts',
      `select=id,status,published_at&status=in.(published,published_dryrun)&published_at=gte.${since}`
    );
    if (!posts.length) return res.status(200).json({ measured: 0 });

    const ids = posts.map(p => p.id);
    const existing = await sbSelect(
      'marketing_metrics',
      `select=post_id&post_id=in.(${ids.join(',')})`
    );
    const measured = new Set(existing.map(m => m.post_id));
    const toInsert = posts
      .filter(p => !measured.has(p.id))
      .map(p => ({ post_id: p.id, source: 'dryrun', ...fakeMetricsFor(p.id) }));

    if (!toInsert.length) return res.status(200).json({ measured: 0, skipped: posts.length });

    const inserted = await sbInsert('marketing_metrics', toInsert);
    return res.status(200).json({ measured: inserted.length, metrics: inserted });
  } catch (e) {
    Sentry.captureException(e);
    console.error('[marketing/measure]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
