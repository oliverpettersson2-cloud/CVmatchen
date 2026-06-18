-- Marketing agent: closed-loop content/measure/learn
-- Apply via Supabase SQL editor or `supabase db push`.

create table if not exists marketing_posts (
  id              uuid primary key default gen_random_uuid(),
  variant_group   uuid not null,
  label           text not null,                -- 'A' | 'B' | 'C'
  channel         text not null default 'linkedin',
  content         text not null,
  hypothesis      text,
  status          text not null default 'draft',-- draft | selected | published_dryrun | published | failed
  external_id     text,                         -- post-id från LinkedIn när vi går live
  utm_campaign    text not null,
  scheduled_for   timestamptz,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists marketing_posts_variant_group_idx on marketing_posts (variant_group);
create index if not exists marketing_posts_status_idx on marketing_posts (status, published_at);

create table if not exists marketing_metrics (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references marketing_posts(id) on delete cascade,
  fetched_at   timestamptz not null default now(),
  impressions  int not null default 0,
  clicks       int not null default 0,
  ctr          numeric(6,4) generated always as (
                 case when impressions > 0 then clicks::numeric / impressions else 0 end
               ) stored,
  signups      int not null default 0,
  source       text not null default 'dryrun'   -- dryrun | linkedin | plausible
);

create index if not exists marketing_metrics_post_id_idx on marketing_metrics (post_id, fetched_at desc);

create table if not exists marketing_playbook (
  id              uuid primary key default gen_random_uuid(),
  version         int not null,
  content_md      text not null,
  summary         text,
  based_on_posts  uuid[] not null default '{}',
  created_at      timestamptz not null default now()
);

create unique index if not exists marketing_playbook_version_idx on marketing_playbook (version);

-- Lås tabellerna från anon-rollen. Agenten kör mot service_key.
alter table marketing_posts    enable row level security;
alter table marketing_metrics  enable row level security;
alter table marketing_playbook enable row level security;
-- Inga policies = ingen åtkomst för anon/authenticated. service_role bypassar RLS.
