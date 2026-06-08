-- ============================================================================
-- Pilot-invites: kommuner, enheter, admins + bootstrap superadmin
-- Datum: 2026-06-08
-- Multi-tenant: varje kommun lever isolerat. Handläggare ser bara sin
-- kommun/enhet. Superadmin (Oliver) ser allt.
--
-- Kompatibel med befintlig api/supabase.js:
--   admin_login, admin_invite, admin_list_admins, admin_get_enheter,
--   verifyAdmin (multi-tenant-skydd)
--
-- Idempotent: säkert att köra om. Bootstrap-INSERT använder ON CONFLICT.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── kommuner ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kommuner (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  org_nr     TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_pilot   BOOLEAN NOT NULL DEFAULT true,
  pilot_ends TIMESTAMPTZ,  -- 90 dagar fram, NULL för full-drift
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kommuner IS 'Kommuner/organisationer som licensierar CVmatchen. Multi-tenant root.';

-- ── enheter ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enheter (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kommun_id  UUID NOT NULL REFERENCES public.kommuner(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kommun_id, name)
);

CREATE INDEX IF NOT EXISTS idx_enheter_kommun ON public.enheter (kommun_id);

COMMENT ON TABLE public.enheter IS 'Avdelningar/enheter inom en kommun (t.ex. Arbetsmarknadsenheten, Vuxenutbildningen).';

-- ── admins ──────────────────────────────────────────────────────────────────
-- Kolumnerna matchar EXAKT vad api/supabase.js förväntar:
--   admin_login: email, role, kommun_id, enhet_id, last_login
--   admin_invite: invite_token, invite_expires, name, kommun_id, enhet_id, role
CREATE TABLE IF NOT EXISTS public.admins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT,
  role            TEXT NOT NULL DEFAULT 'handlaggare'
                  CHECK (role IN ('superadmin', 'kommunadmin', 'enhetsadmin', 'handlaggare')),
  kommun_id       UUID REFERENCES public.kommuner(id) ON DELETE SET NULL,
  enhet_id        UUID REFERENCES public.enheter(id)  ON DELETE SET NULL,
  invite_token    TEXT,
  invite_expires  TIMESTAMPTZ,
  invited_by      UUID REFERENCES public.admins(id),
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_email   ON public.admins (lower(email));
CREATE INDEX IF NOT EXISTS idx_admins_kommun  ON public.admins (kommun_id);
CREATE INDEX IF NOT EXISTS idx_admins_enhet   ON public.admins (enhet_id);
CREATE INDEX IF NOT EXISTS idx_admins_token   ON public.admins (invite_token) WHERE invite_token IS NOT NULL;

COMMENT ON TABLE public.admins IS 'Handläggare och adminroller. role styr behörighet, kommun_id/enhet_id styr multi-tenant-isolering.';

-- ── Audit-logg för admin-åtgärder (säkerhet/spårbarhet) ─────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON public.admin_audit (admin_id, created_at DESC);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Backend (service_role) kringgår RLS — det är där all admin-logik körs.
-- Direkt frontend-access blockeras. Vi sätter ändå policys för säkerhet.
ALTER TABLE public.kommuner    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enheter     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- Default deny: ingen direkt access via anon-key. Service_role kringgår RLS.
DROP POLICY IF EXISTS kommuner_deny    ON public.kommuner;
DROP POLICY IF EXISTS enheter_deny     ON public.enheter;
DROP POLICY IF EXISTS admins_deny      ON public.admins;
DROP POLICY IF EXISTS audit_deny       ON public.admin_audit;
CREATE POLICY kommuner_deny ON public.kommuner FOR ALL USING (false);
CREATE POLICY enheter_deny  ON public.enheter  FOR ALL USING (false);
CREATE POLICY admins_deny   ON public.admins   FOR ALL USING (false);
CREATE POLICY audit_deny    ON public.admin_audit FOR ALL USING (false);

-- ============================================================================
-- BOOTSTRAP — kör en gång. ON CONFLICT gör det säkert att köra om.
-- ============================================================================

-- 1) Skapa pilotkommunerna
INSERT INTO public.kommuner (name, org_nr, contact_email, is_pilot, pilot_ends, notes)
VALUES
  ('Helsingborg',  '212000-1157', NULL, true, now() + interval '90 days', 'Hemma-pilot. Oliver är SYV där.'),
  ('Perstorp',     '212000-0910', NULL, true, now() + interval '90 days', 'Första externa pilot. Kontakt: Peter Lindow.'),
  ('PathfinderAI', NULL,          'info@cvmatchen.com', false, NULL,       'Intern test-tenant — använd för demo/QA.')
ON CONFLICT (name) DO NOTHING;

-- 2) Skapa enheter per kommun
INSERT INTO public.enheter (kommun_id, name)
SELECT k.id, e.name
FROM (VALUES
  ('Helsingborg',  'Arbetsmarknadsenheten'),
  ('Helsingborg',  'Vuxenutbildningen'),
  ('Perstorp',     'Arbetsmarknadsenheten'),
  ('PathfinderAI', 'Demo')
) AS e(kommun_name, name)
JOIN public.kommuner k ON k.name = e.kommun_name
ON CONFLICT (kommun_id, name) DO NOTHING;

-- 3) Bootstrap superadmin (Oliver)
--    role='superadmin' = ser alla kommuner, kan bjuda in vem som helst.
--    Ingen kommun_id/enhet_id eftersom superadmin är tenant-agnostic.
INSERT INTO public.admins (email, name, role, last_login)
VALUES (
  'oliver.mac@pathfinderai.se',
  'Oliver Pettersson',
  'superadmin',
  NULL
)
ON CONFLICT (email) DO UPDATE SET
  role = 'superadmin',
  name = COALESCE(public.admins.name, EXCLUDED.name);

-- 3b) Lägg även till privat-mejlen som kommunadmin för Helsingborg
--     (handläggar-rollen — kan testa handläggar-flödet utan superadmin-privilegier)
INSERT INTO public.admins (email, name, role, kommun_id, enhet_id)
SELECT
  'oliver.pettersson2@gmail.com',
  'Oliver Pettersson (test)',
  'handlaggare',
  k.id,
  e.id
FROM public.kommuner k
LEFT JOIN public.enheter e
  ON e.kommun_id = k.id AND e.name = 'Arbetsmarknadsenheten'
WHERE k.name = 'Helsingborg'
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- VERIFIERING (kör efteråt för att bekräfta)
-- ============================================================================
-- SELECT k.name AS kommun, COUNT(e.id) AS antal_enheter, k.is_pilot, k.pilot_ends::date
-- FROM public.kommuner k
-- LEFT JOIN public.enheter e ON e.kommun_id = k.id
-- GROUP BY k.id, k.name, k.is_pilot, k.pilot_ends
-- ORDER BY k.name;
--
-- SELECT a.email, a.role, k.name AS kommun, e.name AS enhet
-- FROM public.admins a
-- LEFT JOIN public.kommuner k ON k.id = a.kommun_id
-- LEFT JOIN public.enheter  e ON e.id = a.enhet_id
-- ORDER BY a.role, a.email;
