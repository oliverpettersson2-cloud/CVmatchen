-- ============================================================================
-- Intervju-träningstabeller — interview_sessions, interview_messages, saved_questions
-- Datum: 2026-06-08
-- Kör i Supabase SQL-editor. Idempotent (IF NOT EXISTS) — säkert att köra om
-- även om tabellerna redan finns. Kolumner matchar exakt vad api/supabase.js
-- och intervju.js förväntar sig.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── interview_sessions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch            TEXT NOT NULL,
  company           TEXT,
  role_title        TEXT,
  difficulty        TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  job_match_id      TEXT,
  status            TEXT NOT NULL DEFAULT 'active'  CHECK (status IN ('active','completed','abandoned')),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ,
  duration_seconds  INTEGER,
  overall_feedback  TEXT,
  user_rating       INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  user_notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_started
  ON public.interview_sessions (user_id, started_at DESC);

-- ── interview_messages ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('interviewer','candidate')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_messages_session
  ON public.interview_messages (session_id, created_at);

-- ── saved_questions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id     UUID REFERENCES public.interview_sessions(id) ON DELETE SET NULL,
  message_id     UUID REFERENCES public.interview_messages(id) ON DELETE SET NULL,
  question_text  TEXT NOT NULL,
  user_answer    TEXT,
  category       TEXT,
  difficulty     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_questions_user
  ON public.saved_questions (user_id, created_at DESC);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- intervju.js anropar via användarens JWT (authHeaders(accessToken)), så RLS
-- gäller. Policys nedan låter varje användare bara läsa/skriva sina egna rader.
ALTER TABLE public.interview_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_questions     ENABLE ROW LEVEL SECURITY;

-- interview_sessions: user_id = auth.uid()
DROP POLICY IF EXISTS interview_sessions_owner_all ON public.interview_sessions;
CREATE POLICY interview_sessions_owner_all
  ON public.interview_sessions
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- interview_messages: ägaren av session_id
DROP POLICY IF EXISTS interview_messages_owner_all ON public.interview_messages;
CREATE POLICY interview_messages_owner_all
  ON public.interview_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.interview_sessions s
      WHERE s.id = interview_messages.session_id AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.interview_sessions s
      WHERE s.id = interview_messages.session_id AND s.user_id = auth.uid()
    )
  );

-- saved_questions: user_id = auth.uid()
DROP POLICY IF EXISTS saved_questions_owner_all ON public.saved_questions;
CREATE POLICY saved_questions_owner_all
  ON public.saved_questions
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- VERIFIERING (kör efteråt)
-- ============================================================================
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--     AND table_name IN ('interview_sessions','interview_messages','saved_questions');
