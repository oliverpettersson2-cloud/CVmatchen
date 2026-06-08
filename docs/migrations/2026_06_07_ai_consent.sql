-- ============================================================================
-- AI-samtycke (GDPR art. 6.1.a + art. 22 vid automatiserat beslutsfattande)
-- Datum: 2026-06-07
-- Kör i Supabase SQL-editor (eller via supabase/cli migrations).
-- Idempotent: säkert att köra om.
-- ============================================================================

-- Lägg till samtyckes-kolumner på user_assignments
ALTER TABLE public.user_assignments
  ADD COLUMN IF NOT EXISTS ai_consent_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_consent_version   TEXT,
  ADD COLUMN IF NOT EXISTS ai_consent_withdrawn_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_assignments.ai_consent_at        IS 'Tidpunkt då deltagaren godkände AI-analys av CV/svar. NULL = ej godkänt.';
COMMENT ON COLUMN public.user_assignments.ai_consent_version   IS 'Versionssträng för samtyckes-texten som visades (t.ex. "2026-06-07").';
COMMENT ON COLUMN public.user_assignments.ai_consent_withdrawn_at IS 'Tidpunkt då deltagaren återkallade samtycket. NULL = aktivt.';

-- Index för admins som filtrerar på samtyckes-status
CREATE INDEX IF NOT EXISTS idx_user_assignments_ai_consent_at
  ON public.user_assignments (ai_consent_at);

-- ============================================================================
-- VERIFIERING (kör efteråt för att bekräfta)
-- ============================================================================
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'user_assignments'
--   AND column_name LIKE 'ai_consent%';
