-- ============================================================
-- CVmatchen — datamodell för programverksamhet (pilot Landskrona)
--
-- Tre delar:
--   1. Rättar en befintlig bugg: rollen 'enhetsadmin' används av
--      kod och gränssnitt men nekades av databasen, så inbjudan av
--      en enhetsadmin misslyckades.
--   2. Programfält på deltagarposten (user_assignments). Alla är
--      frivilliga: NULL betyder att deltagaren inte går i ett
--      program, och CVmatchen fungerar då precis som förut.
--   3. program_logg — vem ändrade vad, och när. Underlag både för
--      spårbarhet (B3) och för månadsrapportens övergångar (F7).
--
-- Kolumnen user_assignments.status betyder AKTIVITETSSTATUS
-- (active/recent/new/inactive) och lämnas orörd. Programstatus
-- enligt kravspecen ligger i en egen kolumn, programstatus.
--
-- Idempotent: går att köra om utan att något går sönder.
-- ============================================================

-- 1. Rollen enhetsadmin ------------------------------------------------
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check
  check (role = any (array['superadmin','kommunadmin','enhetsadmin','handlaggare']));

-- 2. Programfält ------------------------------------------------------
alter table public.user_assignments
  add column if not exists spar               text,
  add column if not exists fas                text,
  add column if not exists fas_andrad_at      timestamptz,
  add column if not exists program_start      date,
  add column if not exists program_slut       date,
  add column if not exists programstatus      text,
  -- sfi-uppgifter som PERSONALEN har kontrollerat. Deltagarens egen
  -- uppgift i språktestet är självrapporterad och räcker inte som
  -- underlag för att belägga språkskalan mot ett externt mått.
  add column if not exists sfi_kurs           text,
  add column if not exists sfi_betyg          text,
  add column if not exists sfi_verifierad_av  bigint references public.admins(id) on delete set null,
  add column if not exists sfi_verifierad_at  timestamptz;

alter table public.user_assignments drop constraint if exists ua_spar_check;
alter table public.user_assignments add constraint ua_spar_check
  check (spar is null or spar in ('ordinarie','foraldraspar'));

alter table public.user_assignments drop constraint if exists ua_fas_check;
alter table public.user_assignments add constraint ua_fas_check
  check (fas is null or fas in ('landa','rusta','valja_soka'));

alter table public.user_assignments drop constraint if exists ua_programstatus_check;
alter table public.user_assignments add constraint ua_programstatus_check
  check (programstatus is null or programstatus in ('aktiv','avslutad','avbrott'));

alter table public.user_assignments drop constraint if exists ua_sfi_kurs_check;
alter table public.user_assignments add constraint ua_sfi_kurs_check
  check (sfi_kurs is null or sfi_kurs in ('ingen','A','B','C','D','klar_D'));

-- Sfi betygssätts A–F där F är underkänt. 'pagar' = kursen är inte avslutad.
alter table public.user_assignments drop constraint if exists ua_sfi_betyg_check;
alter table public.user_assignments add constraint ua_sfi_betyg_check
  check (sfi_betyg is null or sfi_betyg in ('A','B','C','D','E','F','pagar'));

alter table public.user_assignments drop constraint if exists ua_program_datum_check;
alter table public.user_assignments add constraint ua_program_datum_check
  check (program_start is null or program_slut is null or program_slut >= program_start);

-- 3. Händelselogg -----------------------------------------------------
create table if not exists public.program_logg (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  typ        text not null,   -- spar | fas | programstatus | program_start | program_slut | sfi_kurs | sfi_betyg
  fran       text,
  till       text,
  admin_id   bigint references public.admins(id) on delete set null,
  skapad_at  timestamptz not null default now()
);

create index if not exists program_logg_user_idx
  on public.program_logg (user_id, skapad_at desc);

-- RLS på utan policies: bara backend (service role) läser och skriver.
-- Deltagaren har ingen anledning att läsa personalens ändringslogg direkt.
alter table public.program_logg enable row level security;
