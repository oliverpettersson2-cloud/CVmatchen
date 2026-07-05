-- ============================================================================
-- 2026-06-10: user_consents — tidsstämplad logg av användarens AI-samtycke
-- ----------------------------------------------------------------------------
-- Krav från GDPR + PuB-avtal (kommun-pilot): personuppgiftsansvarig
-- (kommunen) måste kunna bevisa att invånaren aktivt samtyckt till att
-- AI behandlar personuppgifterna. Läsbar policyversion + tidsstämpel +
-- IP/user-agent räcker för att uppfylla ansvarsplikten (art. 5.2 GDPR).
--
-- policy_version bumpas när innehållet i integritetspolicyn ändras
-- materiellt. Vid bump ska användaren behöva samtycka igen — därför
-- unique(user_id, policy_version), inte bara user_id.
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_consents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,
  policy_version text NOT NULL,
  granted_at   timestamptz NOT NULL DEFAULT now(),
  ip           text,
  user_agent   text,
  UNIQUE(user_id, policy_version)
);

CREATE INDEX IF NOT EXISTS idx_user_consents_user
  ON user_consents (user_id);

CREATE INDEX IF NOT EXISTS idx_user_consents_user_version
  ON user_consents (user_id, policy_version);

-- RLS: bara service-role får läsa/skriva. Vanliga användare når inte
-- tabellen. Verifierade access-tokens går genom våra endpoints.
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_public_access" ON user_consents;
CREATE POLICY "no_public_access" ON user_consents
  FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE user_consents IS 'Tidsstämplade AI-samtycken per policyversion. Bevis för GDPR-ansvarsplikt.';
