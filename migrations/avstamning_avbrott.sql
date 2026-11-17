-- ============================================================
-- CVmatchen — veckoavstämning (kravspec F4) och avbrott (F8)
--
-- F8: när programstatus blir avbrott eller avslutad anges orsak från
--     en fast lista plus valfri fritext. Listan innehåller medvetet
--     ingen hälsoorsak (pilot 1 samlar inte in hälsodata):
--     "personliga_skal" täcker det utan att säga varför.
--
-- F4: en avstämning per deltagare och vecka med tre fält. "Nästa vecka"
--     visas för deltagaren som veckans plan.
--
-- RLS påslaget utan policyer: endast backend läser och skriver.
-- Idempotent.
-- ============================================================

alter table public.user_assignments add column if not exists avslut_orsak     text;
alter table public.user_assignments add column if not exists avslut_kommentar text;
alter table public.user_assignments drop constraint if exists ua_avslut_orsak_check;
alter table public.user_assignments add constraint ua_avslut_orsak_check
  check (avslut_orsak is null or avslut_orsak in
    ('jobb','studier','annan_insats','flyttat','personliga_skal','uteblivit','annat'));
alter table public.user_assignments drop constraint if exists ua_avslut_kommentar_check;
alter table public.user_assignments add constraint ua_avslut_kommentar_check
  check (avslut_kommentar is null or length(avslut_kommentar) <= 300);

create table if not exists public.avstamning (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  vecka          date not null,                 -- veckans måndag
  hur_gick       text check (length(hur_gick) <= 1000),
  svart          text check (length(svart) <= 1000),
  nasta_vecka    text check (length(nasta_vecka) <= 1000),
  skapad_av      bigint references public.admins(id) on delete set null,
  skapad_at      timestamptz not null default now(),
  uppdaterad_at  timestamptz not null default now(),
  unique (user_id, vecka),
  check (extract(isodow from vecka) = 1)
);
create index if not exists avstamning_user_idx on public.avstamning (user_id, vecka desc);
alter table public.avstamning enable row level security;
