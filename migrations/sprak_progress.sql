-- ============================================================
-- CVmatchen — tabell för språkträningens progress
--
-- Följer exakt samma konvention som saved_cvs och job_diary:
-- primärnyckel på user_id (ingen separat id-kolumn), kaskad mot
-- auth.users, och EN RLS-policy "Egen data" med FOR ALL.
-- Det gör att den befintliga save_table-vägen i api/supabase.js
-- (DELETE följt av INSERT per user_id) fungerar utan särkod.
--
-- data-blobben ser ut så här:
--   { "<bransch>": { "<ovningstyp>": { pass, ratt, totalt, tidSek, senast } },
--     "_uppdaterad": "<iso-tid>" }
-- tidSek = AKTIV träningstid i sekunder. Klockan pausas när fliken
-- döljs och efter 90 s utan interaktion, så loggen visar faktisk
-- träning och inte hur länge webbläsaren stått på.
--
-- Idempotent: går att köra om utan att något går sönder.
-- ============================================================

create table if not exists public.sprak_progress (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  data      jsonb not null default '{}'::jsonb,
  saved_at  timestamptz default now()
);

alter table public.sprak_progress enable row level security;

drop policy if exists "Egen data" on public.sprak_progress;
create policy "Egen data" on public.sprak_progress
  for all using (auth.uid() = user_id);

-- ============================================================
-- GDPR-radering
-- Raderas automatiskt via "on delete cascade" mot auth.users.
-- Tabellen finns dessutom med i TABLES-listan i api/supabase.js
-- (admin_delete_user + user_delete_self) så radering fungerar
-- även när auth-posten behålls.
-- ============================================================
