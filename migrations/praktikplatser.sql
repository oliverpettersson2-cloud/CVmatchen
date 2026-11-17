-- ============================================================
-- CVmatchen — praktikplatser och matchning
--
-- praktikplatser     En plats hos en arbetsgivare: innehåll, förväntningar,
--                    timmar, plats, krav. Hör till en verksamhet
--                    (kommun och ev. enhet), precis som veckoschemat.
-- praktik_kandidat   En deltagare kopplad till en plats, med status från
--                    förslag till placering. Här landar matchningen, och
--                    det är härifrån platsen senare delas med deltagaren.
--
-- Inga hälsouppgifter: "krav" beskriver arbetet (t.ex. "tunga lyft"),
-- aldrig deltagarens hälsa.
--
-- RLS påslaget utan policyer: endast backend läser och skriver.
-- Idempotent: går att köra om.
-- ============================================================

create table if not exists public.praktikplatser (
  id               bigint generated always as identity primary key,
  kommun_id        bigint not null references public.kommuner(id) on delete cascade,
  enhet_id         bigint references public.enheter(id) on delete cascade,
  titel            text not null check (length(titel) between 1 and 120),
  arbetsgivare     text not null check (length(arbetsgivare) between 1 and 120),
  yrkesomrade      text check (yrkesomrade in ('vard','lager','service','bygg','kontor','handel','restaurang','stad','annat')),
  adress           text check (length(adress) <= 200),
  ort              text check (length(ort) <= 80),
  kontakt_namn     text check (length(kontakt_namn) <= 120),
  kontakt_telefon  text check (length(kontakt_telefon) <= 40),
  kontakt_epost    text check (length(kontakt_epost) <= 160),
  innehall         text check (length(innehall) <= 2000),    -- vad deltagaren gör
  forvantningar    text check (length(forvantningar) <= 2000),
  krav             text check (length(krav) <= 1000),       -- arbetets krav, inte deltagarens hälsa
  timmar_per_vecka numeric(4,1) check (timmar_per_vecka > 0 and timmar_per_vecka <= 40),
  arbetstider      text check (length(arbetstider) <= 200),
  start_datum      date,
  slut_datum       date,
  antal_platser    smallint not null default 1 check (antal_platser between 1 and 50),
  min_sprak_steg   smallint check (min_sprak_steg between 0 and 4),  -- språktestets steg
  korkort_krav     boolean not null default false,
  status           text not null default 'oppen' check (status in ('utkast','oppen','tillsatt','avslutad')),
  skapad_av        bigint references public.admins(id) on delete set null,
  skapad_at        timestamptz not null default now(),
  uppdaterad_at    timestamptz not null default now(),
  check (slut_datum is null or start_datum is null or slut_datum >= start_datum)
);
create index if not exists praktikplatser_scope_idx on public.praktikplatser (kommun_id, enhet_id, status);
alter table public.praktikplatser enable row level security;

create table if not exists public.praktik_kandidat (
  id             bigint generated always as identity primary key,
  praktik_id     bigint not null references public.praktikplatser(id) on delete cascade,
  user_id        uuid not null,
  status         text not null default 'forslag'
                 check (status in ('forslag','tillfragad','intresserad','nej','placerad','avslutad')),
  poang          smallint check (poang between 0 and 100),
  motivering     text check (length(motivering) <= 600),
  kommentar      text check (length(kommentar) <= 300),
  skapad_av      bigint references public.admins(id) on delete set null,
  skapad_at      timestamptz not null default now(),
  uppdaterad_at  timestamptz not null default now(),
  unique (praktik_id, user_id)
);
create index if not exists praktik_kandidat_user_idx on public.praktik_kandidat (user_id);
alter table public.praktik_kandidat enable row level security;
