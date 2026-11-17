-- ============================================================
-- CVmatchen — grupper inom en verksamhet
--
-- Kommunen är kvar som kund och personuppgiftsansvarig. Inom
-- verksamheten (kommun + ev. enhet) finns grupper, t.ex. Jobbnära,
-- Hälsa och Mässprepp. En deltagare kan vara med i flera grupper.
--
-- grupper          Namn, typ (löpande eller termin) och period.
-- grupp_deltagare  Vilka som är med.
-- pass_mall.grupper / pass_instans.grupper
--                  Passet gäller bara medlemmar i någon av grupperna.
--                  NULL = alla, precis som faser och spår.
--
-- Gruppnamn ska vara neutrala: ett namn som avslöjar hälsobesvär gör
-- medlemslistan till hälsodata.
--
-- RLS påslaget utan policyer: endast backend läser och skriver.
-- Idempotent.
-- ============================================================

create table if not exists public.grupper (
  id           bigint generated always as identity primary key,
  kommun_id    bigint not null references public.kommuner(id) on delete cascade,
  enhet_id     bigint references public.enheter(id) on delete cascade,
  namn         text not null check (length(namn) between 1 and 60),
  typ          text not null default 'lopande' check (typ in ('lopande','termin')),
  beskrivning  text check (length(beskrivning) <= 500),
  start_datum  date,
  slut_datum   date,
  aktiv        boolean not null default true,
  skapad_av    bigint references public.admins(id) on delete set null,
  skapad_at    timestamptz not null default now(),
  check (slut_datum is null or start_datum is null or slut_datum >= start_datum),
  check (typ = 'lopande' or (start_datum is not null and slut_datum is not null))
);
create index if not exists grupper_scope_idx on public.grupper (kommun_id, enhet_id) where aktiv;
alter table public.grupper enable row level security;

create table if not exists public.grupp_deltagare (
  grupp_id    bigint not null references public.grupper(id) on delete cascade,
  user_id     uuid not null,
  tillagd_av  bigint references public.admins(id) on delete set null,
  tillagd_at  timestamptz not null default now(),
  primary key (grupp_id, user_id)
);
create index if not exists grupp_deltagare_user_idx on public.grupp_deltagare (user_id);
alter table public.grupp_deltagare enable row level security;

alter table public.pass_mall    add column if not exists grupper bigint[];
alter table public.pass_instans add column if not exists grupper bigint[];
