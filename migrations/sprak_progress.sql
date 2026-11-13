-- ============================================================
-- CVmatchen — tabell för språkträningens progress
-- Kör i Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Idempotent: går att köra om utan att något går sönder.
--
-- Samma form som saved_cvs / job_diary så den befintliga
-- save_table-vägen i api/supabase.js fungerar utan särkod.
-- ============================================================

create table if not exists public.sprak_progress (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  data      jsonb not null default '{}'::jsonb,
  saved_at  timestamptz not null default now()
);

-- En rad per deltagare
create unique index if not exists sprak_progress_user_id_key
  on public.sprak_progress (user_id);

alter table public.sprak_progress enable row level security;

-- Deltagaren når bara sin egen rad
drop policy if exists "sprak_progress_select_own" on public.sprak_progress;
create policy "sprak_progress_select_own" on public.sprak_progress
  for select using (auth.uid() = user_id);

drop policy if exists "sprak_progress_insert_own" on public.sprak_progress;
create policy "sprak_progress_insert_own" on public.sprak_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "sprak_progress_update_own" on public.sprak_progress;
create policy "sprak_progress_update_own" on public.sprak_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sprak_progress_delete_own" on public.sprak_progress;
create policy "sprak_progress_delete_own" on public.sprak_progress
  for delete using (auth.uid() = user_id);

-- ============================================================
-- VIKTIGT — GDPR-radering
-- admin_delete_user och user_delete_self i api/supabase.js
-- kaskaderar över en lista med tabeller. Den här tabellen
-- raderas automatiskt via "on delete cascade" mot auth.users,
-- men lägg ändå till 'sprak_progress' i raderingslistan så att
-- radering fungerar även om auth-posten behålls.
-- ============================================================
