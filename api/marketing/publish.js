// POST /api/marketing/publish
// MVP: DRY-RUN — markerar valt utkast som "published_dryrun" utan att anropa LinkedIn.
// Body: { post_id?: string, variant_group?: string, pick?: 'first' | 'random' }
// Headers: Authorization: Bearer <MARKETING_AGENT_TOKEN>

import * as Sentry from '@sentry/node';
import { requireAgentAuth, sbSelect, sbUpdate } from './_lib.js';

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = requireAgentAuth(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  try {
    const { post_id, variant_group, pick = 'first' } = req.body || {};
    let targetId = post_id;

    if (!targetId) {
      if (!variant_group) return res.status(400).json({ error: 'post_id eller variant_group krävs' });
      const drafts = await sbSelect(
        'marketing_posts',
        `select=id,label&variant_group=eq.${variant_group}&status=eq.draft&order=label.asc`
      );
      if (!drafts.length) return res.status(404).json({ error: 'Inga drafts i variant_group' });
      targetId = pick === 'random'
        ? drafts[Math.floor(Math.random() * drafts.length)].id
        : drafts[0].id;
    }

    // I MVP publicerar vi ALLA varianter samtidigt (dry-run) så vi får metrics
    // på alla tre. När vi går live: byt till att publicera 1, mät, sen lär.
    const updated = await sbUpdate(
      'marketing_posts',
      `variant_group=eq.${variant_group || ''}${variant_group ? '' : `&id=eq.${targetId}`}&status=eq.draft`,
      { status: 'published_dryrun', published_at: new Date().toISOString() }
    );

    return res.status(200).json({
      mode: 'dryrun',
      published_count: updated.length,
      ids: updated.map(r => r.id),
    });
  } catch (e) {
    Sentry.captureException(e);
    console.error('[marketing/publish]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
