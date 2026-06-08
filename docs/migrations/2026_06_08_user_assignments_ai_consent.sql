-- ============================================================================
-- user_assignments (minimal) + AI-samtycke
-- Datum: 2026-06-08 (ERSÄTTER 2026_06_07_ai_consent.sql)
--
-- Bakgrund: user_assignments är deltagar-tabellen som hela pilot-systemet
-- bygger på. Den skapas normalt av pilot-invites-migrationen (gjord i hubben).
-- Den här filen skapar en MINIMAL version + ai_consent-kolumnerna så att
-- AI-samtycke fungerar direkt — utan att vänta på pilot-invites-arbetet.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS. Säker
-- att köra även om hubben senare lägger till fler kolumner (kommun_id,
-- enhet_id, role, invited_by, etc) — de adderas då via egen migration.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── user_assignments (minimal) ──────────────────────────────────────────────
-- Kolumner som api/supabase.js använder idag (utöver pilot-invites-fält):
--   user_id, name, phone, status, created_at
CREATE TABLE IF NOT EXISTS public.user_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  phone       TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bara en rad per user (ensure_participant använder upsert-mönster)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_assignments_user_unique
  ON public.user_assignments (user_id);

-- Pilot-invites-fält som hubben kommer lägga till senare — vi förbereder
-- bara om-de-redan-finns-check så vår migration inte krockar.
ALTER TABLE public.user_assignments
  ADD COLUMN IF NOT EXISTS kommun_id  UUID,
  ADD COLUMN IF NOT EXISTS enhet_id   UUID;

CREATE INDEX IF NOT EXISTS idx_user_assignments_kommun ON public.user_assignments (kommun_id);
CREATE INDEX IF NOT EXISTS idx_user_assignments_enhet  ON public.user_assignments (enhet_id);

-- ── AI-samtyckes-kolumner (GDPR art. 6.1.a) ─────────────────────────────────
ALTER TABLE public.user_assignments
  ADD COLUMN IF NOT EXISTS ai_consent_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_consent_version      TEXT,
  ADD COLUMN IF NOT EXISTS ai_consent_withdrawn_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_assignments.ai_consent_at           IS 'Tidpunkt då deltagaren godkände AI-analys av CV/svar. NULL = ej godkänt.';
COMMENT ON COLUMN public.user_assignments.ai_consent_version      IS 'Versionssträng för samtyckes-texten som visades (t.ex. "2026-06-07").';
COMMENT ON COLUMN public.user_assignments.ai_consent_withdrawn_at IS 'Tidpunkt då deltagaren återkallade samtycket. NULL = aktivt.';

CREATE INDEX IF NOT EXISTS idx_user_assignments_ai_consent_at
  ON public.user_assignments (ai_consent_at);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- ensure_participant + save_ai_consent anropar via service_role (backend),
-- men deltagare ska ändå kunna LÄSA sin egen rad om de loggar in själva.
-- Backend-anrop påverkas inte av RLS när service-key används.
ALTER TABLE public.user_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_assignments_owner_select ON public.user_assignments;
CREATE POLICY user_assignments_owner_select
  ON public.user_assignments
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- VERIFIERING
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_schema='public' AND table_name='user_assignments'
--   ORDER BY ordinal_position;
