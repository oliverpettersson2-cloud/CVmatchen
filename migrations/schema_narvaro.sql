-- ============================================================
-- CVmatchen — veckoschema, pass och närvaro (kravspec F1 + grund för F2)
--
-- pass_mall     Veckoschemat. Personalen lägger in det en gång.
-- pass_instans  Ett faktiskt pass ett visst datum. Skapas från mallen
--               första gången personalen öppnar dagen. Tid, titel och
--               vilka faser/spår passet gäller KOPIERAS in, så att en
--               senare ändring av veckoschemat aldrig skriver om vad
--               som gällde ett passerat datum.
-- narvaro       En rad per deltagare och pass.
--
-- Alla tre har RLS påslaget utan policyer: endast backend läser och
-- skriver. Deltagaren får sin egen närvaro via backend.
--
-- Idempotent: går att köra om utan att något går sönder.
-- ============================================================

create table if not exists public.pass_mall (
  id          bigint generated always as identity primary key,
  kommun_id   bigint not null references public.kommuner(id) on delete cascade,
  enhet_id    bigint references public.enheter(id) on delete cascade,
  veckodag    smallint not null check (veckodag between 1 and 7),   -- 1 = måndag
  starttid    time not null,
  sluttid     time not null,
  titel       text not null check (length(titel) between 1 and 120),
  typ         text not null check (typ in ('L','U','A','D')),      -- lokal, ute, arbetsgivare, digitalt
  faser       text[],          -- NULL = alla faser
  spar        text[],          -- NULL = alla spår
  aktiv       boolean not null default true,
  skapad_av   bigint references public.admins(id) on delete set null,
  skapad_at   timestamptz not null default now(),
  check (sluttid > starttid)
);
create index if not exists pass_mall_scope_idx on public.pass_mall (kommun_id, enhet_id, veckodag) where aktiv;

create table if not exists public.pass_instans (
  id            bigint generated always as identity primary key,
  pass_mall_id  bigint references public.pass_mall(id) on delete set null,
  kommun_id     bigint not null references public.kommuner(id) on delete cascade,
  enhet_id      bigint references public.enheter(id) on delete cascade,
  datum         date not null,
  starttid      time not null,
  sluttid       time not null,
  titel         text not null,
  typ           text not null check (typ in ('L','U','A','D')),
  faser         text[],
  spar          text[],
  installt      boolean not null default false,
  kommentar     text check (kommentar is null or length(kommentar) <= 300),
  skapad_at     timestamptz not null default now(),
  check (sluttid > starttid),
  unique (pass_mall_id, datum)
);
create index if not exists pass_instans_dag_idx on public.pass_instans (kommun_id, datum);

create table if not exists public.narvaro (
  id               bigint generated always as identity primary key,
  pass_instans_id  bigint not null references public.pass_instans(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  status           text not null check (status in ('narvarande','sen','franvarande_giltig','franvarande_ogiltig')),
  kommentar        text check (kommentar is null or length(kommentar) <= 300),
  registrerad_av   bigint references public.admins(id) on delete set null,
  registrerad_at   timestamptz not null default now(),
  unique (pass_instans_id, user_id)
);
create index if not exists narvaro_user_idx on public.narvaro (user_id);

alter table public.pass_mall    enable row level security;
alter table public.pass_instans enable row level security;
alter table public.narvaro      enable row level security;

-- ── Serier ────────────────────────────────────────────────────────────
-- Ett pass som återkommer flera dagar i veckan ("Svenska i grupp,
-- mån–tor 09–11") är EN serie: en rad per veckodag som delar serie_id
-- och ändras tillsammans. Giltighetstid och intervall (varje eller
-- varannan vecka) gäller hela serien.
alter table public.pass_mall
  add column if not exists serie_id          uuid not null default gen_random_uuid(),
  add column if not exists giltig_fran       date not null default current_date,
  add column if not exists giltig_till       date,
  add column if not exists intervall_veckor  smallint not null default 1;
alter table public.pass_mall drop constraint if exists pass_mall_intervall_check;
alter table public.pass_mall add constraint pass_mall_intervall_check check (intervall_veckor in (1,2));
alter table public.pass_mall drop constraint if exists pass_mall_giltig_check;
alter table public.pass_mall add constraint pass_mall_giltig_check check (giltig_till is null or giltig_till >= giltig_fran);
create index if not exists pass_mall_serie_idx on public.pass_mall (serie_id);
