-- ============================================================================
-- user_invites: handläggare/admin bjuder in deltagare (slutanvändare)
-- Datum: 2026-06-09
--
-- Flöde: admin skapar invite → token skickas till mottagaren → mottagaren
-- klickar länk + skapar konto via magic-link → user_assignments får auto
-- rätt kommun_id/enhet_id baserat på invite.
--
-- Idempotent: säkert att köra om.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_invites (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL,
  token            TEXT NOT NULL UNIQUE,
  kommun_id        UUID REFERENCES public.kommuner(id) ON DELETE SET NULL,
  enhet_id         UUID REFERENCES public.enheter(id)  ON DELETE SET NULL,
  invited_by       BIGINT REFERENCES public.admins(id) ON DELETE SET NULL,
  invite_message   TEXT,
  expires_at       TIMESTAMPTZ NOT NULL,
  consumed_at      TIMESTAMPTZ,
  consumed_user_id UUID,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_invites_email
  ON public.user_invites (lower(email)) WHERE consumed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_invites_token
  ON public.user_invites (token) WHERE consumed_at IS NULL;

ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_invites_deny ON public.user_invites;
CREATE POLICY user_invites_deny ON public.user_invites FOR ALL USING (false);

COMMENT ON TABLE public.user_invites IS
  'Inbjudningar till deltagare. Konsumeras vid första save_ai_consent som matchar email.';
