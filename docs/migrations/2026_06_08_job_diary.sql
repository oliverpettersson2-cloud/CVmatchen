-- ============================================================================
-- job_diary — jobbdagbok per användare (sökta jobb för aktivitetsrapport)
-- Datum: 2026-06-08
-- Kör i Supabase SQL-editor. Idempotent (IF NOT EXISTS) — säkert att köra
-- om även om tabellen redan finns. Struktur matchar saved_cvs/matched_cvs
-- (en rad per användare med hela listan i data-jsonb), eftersom
-- api/supabase.js save_table gör DELETE+INSERT av hela listan.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── job_diary ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_diary (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB NOT NULL DEFAULT '[]'::jsonb,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- En rad per användare (save_table DELETE:ar + INSERTar hela listan)
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_diary_user_unique
  ON public.job_diary (user_id);

COMMENT ON TABLE  public.job_diary IS 'Jobbdagbok per deltagare. data = array av sökta jobb (jobTitle, company, jobUrl, applied, appliedAt, status).';
COMMENT ON COLUMN public.job_diary.data IS 'Hela diary-listan som jsonb. Behandlas som opaque blob av API:t.';

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Frontend anropar via användarens JWT (authHeaders(accessToken)).
ALTER TABLE public.job_diary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS job_diary_owner_all ON public.job_diary;
CREATE POLICY job_diary_owner_all
  ON public.job_diary
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Handläggar-läsning ──────────────────────────────────────────────────────
-- Handläggare ska kunna se sina deltagares antal sökta jobb. Vi gör det via
-- en SECURITY DEFINER-funktion som returnerar count + senaste appliedAt
-- för varje deltagare i handläggarens enhet. Anropas från handlaggare.html.
-- (Behörighet säkras i api/supabase.js admin_* med verifyAdmin.)
CREATE OR REPLACE FUNCTION public.admin_get_diary_stats(p_user_id UUID)
RETURNS TABLE (
  applied_count   INTEGER,
  last_applied_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(jsonb_array_length(
      (SELECT jsonb_agg(elem) FROM public.job_diary jd,
       jsonb_array_elements(jd.data) elem
       WHERE jd.user_id = p_user_id AND (elem->>'applied')::boolean = true)
    ), 0)::int AS applied_count,
    (SELECT MAX((elem->>'appliedAt')::bigint)
       FROM public.job_diary jd,
            jsonb_array_elements(jd.data) elem
       WHERE jd.user_id = p_user_id
         AND (elem->>'applied')::boolean = true
    )::text::timestamptz AS last_applied_at;
$$;

REVOKE ALL ON FUNCTION public.admin_get_diary_stats(UUID) FROM PUBLIC;
-- Endast service-key (backend) får anropa. Frontend går via /api/supabase.
GRANT EXECUTE ON FUNCTION public.admin_get_diary_stats(UUID) TO service_role;

-- ============================================================================
-- VERIFIERING (kör efteråt för att bekräfta)
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_schema='public' AND table_name='job_diary';
--
-- SELECT * FROM public.admin_get_diary_stats(
--   (SELECT id FROM auth.users WHERE email='<user-email>')
-- );
