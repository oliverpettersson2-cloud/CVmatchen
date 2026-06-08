-- ============================================================================
-- Pilot-invites: kommuner, enheter, admins + bootstrap superadmin
-- Datum: 2026-06-08
-- Multi-tenant: varje kommun lever isolerat. Handläggare ser bara sin
-- kommun/enhet. Superadmin ser allt.
--
-- VIKTIGT: befintlig admins-tabell har id BIGINT. Vi BEHÅLLER den och
-- lägger bara till saknade kolumner. admin_audit/invited_by använder BIGINT
-- för att matcha.
--
-- Idempotent: säkert att köra om.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── kommuner ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kommuner (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS org_nr        TEXT;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS is_pilot      BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS pilot_ends    TIMESTAMPTZ;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS notes         TEXT;
ALTER TABLE public.kommuner ADD COLUMN IF NOT EXISTS created_at    TIMESTAMPTZ NOT NULL DEFAULT now();

-- UNIQUE på name (om saknas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'kommuner_name_key' AND conrelid = 'public.kommuner'::regclass
  ) AND NOT EXISTS (SELECT name FROM public.kommuner GROUP BY name HAVING COUNT(*) > 1) THEN
    ALTER TABLE public.kommuner ADD CONSTRAINT kommuner_name_key UNIQUE (name);
  END IF;
END $$;

-- ── enheter ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enheter (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

ALTER TABLE public.enheter ADD COLUMN IF NOT EXISTS kommun_id  UUID REFERENCES public.kommuner(id) ON DELETE CASCADE;
ALTER TABLE public.enheter ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'enheter_kommun_id_name_key' AND conrelid = 'public.enheter'::regclass
  ) THEN
    ALTER TABLE public.enheter ADD CONSTRAINT enheter_kommun_id_name_key UNIQUE (kommun_id, name);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enheter_kommun ON public.enheter (kommun_id);

-- ── admins: ALTER befintlig tabell, lägg till saknade kolumner ──────────────
-- Om tabellen inte finns alls, skapa den med BIGINT-id (matchar gammal stil).
CREATE TABLE IF NOT EXISTS public.admins (
  id    BIGSERIAL PRIMARY KEY,
  email TEXT
);

ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS email          TEXT;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS name           TEXT;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS role           TEXT NOT NULL DEFAULT 'handlaggare';
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS kommun_id      UUID REFERENCES public.kommuner(id) ON DELETE SET NULL;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS enhet_id       UUID REFERENCES public.enheter(id)  ON DELETE SET NULL;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS invite_token   TEXT;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS invite_expires TIMESTAMPTZ;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS invited_by     BIGINT REFERENCES public.admins(id);
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS last_login     TIMESTAMPTZ;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ NOT NULL DEFAULT now();

-- CHECK på role (drop+add för idempotens)
ALTER TABLE public.admins DROP CONSTRAINT IF EXISTS admins_role_check;
ALTER TABLE public.admins ADD  CONSTRAINT admins_role_check
  CHECK (role IN ('superadmin','kommunadmin','enhetsadmin','handlaggare'));

-- UNIQUE på email (om saknas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admins_email_key' AND conrelid = 'public.admins'::regclass
  ) THEN
    -- Endast om alla email-rader är icke-null och unika
    IF NOT EXISTS (SELECT 1 FROM public.admins WHERE email IS NULL)
       AND NOT EXISTS (SELECT email FROM public.admins GROUP BY email HAVING COUNT(*) > 1) THEN
      ALTER TABLE public.admins ADD CONSTRAINT admins_email_key UNIQUE (email);
    END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_admins_email  ON public.admins (lower(email));
CREATE INDEX IF NOT EXISTS idx_admins_kommun ON public.admins (kommun_id);
CREATE INDEX IF NOT EXISTS idx_admins_enhet  ON public.admins (enhet_id);
CREATE INDEX IF NOT EXISTS idx_admins_token  ON public.admins (invite_token) WHERE invite_token IS NOT NULL;

-- ── Audit-logg ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    BIGINT REFERENCES public.admins(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON public.admin_audit (admin_id, created_at DESC);

-- ── RLS: default deny (service_role kringgår) ───────────────────────────────
ALTER TABLE public.kommuner    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enheter     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS kommuner_deny ON public.kommuner;
DROP POLICY IF EXISTS enheter_deny  ON public.enheter;
DROP POLICY IF EXISTS admins_deny   ON public.admins;
DROP POLICY IF EXISTS audit_deny    ON public.admin_audit;
CREATE POLICY kommuner_deny ON public.kommuner    FOR ALL USING (false);
CREATE POLICY enheter_deny  ON public.enheter     FOR ALL USING (false);
CREATE POLICY admins_deny   ON public.admins      FOR ALL USING (false);
CREATE POLICY audit_deny    ON public.admin_audit FOR ALL USING (false);

-- ============================================================================
-- BOOTSTRAP
-- ============================================================================

INSERT INTO public.kommuner (name, org_nr, is_pilot, pilot_ends)
VALUES
  ('Helsingborg',  '212000-1157', true, now() + interval '90 days'),
  ('Perstorp',     '212000-0910', true, now() + interval '90 days'),
  ('PathfinderAI', NULL,          false, NULL)
ON CONFLICT (name) DO NOTHING;

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

INSERT INTO public.admins (email, role)
VALUES
  ('oliver@cvmatchen.se',    'superadmin'),
  ('cvmatchen@outlook.com',  'superadmin')
ON CONFLICT (email) DO UPDATE SET role = 'superadmin';

-- ============================================================================
-- VERIFIERING
-- ============================================================================
-- SELECT k.name AS kommun, COUNT(e.id) AS antal_enheter, k.is_pilot, k.pilot_ends::date
-- FROM public.kommuner k LEFT JOIN public.enheter e ON e.kommun_id = k.id
-- GROUP BY k.id, k.name, k.is_pilot, k.pilot_ends ORDER BY k.name;
--
-- SELECT a.email, a.role, k.name AS kommun, e.name AS enhet
-- FROM public.admins a
-- LEFT JOIN public.kommuner k ON k.id = a.kommun_id
-- LEFT JOIN public.enheter  e ON e.id = a.enhet_id
-- ORDER BY a.role, a.email;
