-- =============================================================================
-- pending_invites — invite-only registrering (B2B-pilot, kommunkund)
-- =============================================================================
-- Syfte:
--   Stanger den publika OTP-registreringen. En anvandare kan bara skapa konto
--   om deras e-post finns som en pending (icke-utgangen, icke-accepterad) rad
--   i denna tabell, eller om de redan har en rad i user_assignments.
--
--   En admin (superadmin / kommun-admin / enhet-admin / handlaggare) skapar
--   inbjudan via action `admin_invite_user` i api/supabase.js. Nar den
--   inbjudna verifierar sin OTP markeras raden som accepterad och en
--   user_assignments-rad skapas med ratt kommun/enhet/role-scope.
--
-- Tenant-scope:
--   kommun_id + enhet_id arvs fran inbjudande admin (utom superadmin som far
--   bjuda var som helst). RLS laser ner allt — endast service_role ror den
--   har tabellen, all logik gar via api/supabase.js.
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.pending_invites (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null,
  kommun_id             bigint null,
  enhet_id              bigint null,
  invited_by_admin_id   uuid null references public.admins(id) on delete set null,
  role                  text not null check (role in ('admin','handlaggare','invanare')),
  token                 text not null,
  expires_at            timestamptz not null,
  accepted_at           timestamptz null,
  created_at            timestamptz not null default now()
);

comment on table  public.pending_invites is 'Invite-only registreringsko. Endast e-post som ligger har (eller redan i user_assignments) far skapa konto via OTP.';
comment on column public.pending_invites.email is 'Inbjuden e-post. Lowercased av API:t innan insert.';
comment on column public.pending_invites.role is 'Roll som tilldelas vid OTP-verify: admin | handlaggare | invanare.';
comment on column public.pending_invites.token is 'Engangstoken (32 bytes hex). Aldrig returnerad av list/invite-actions, bara via separat (framtida) e-postutskick.';
comment on column public.pending_invites.accepted_at is 'Satts nar inbjudna verifierar OTP. Tomma rader = fortfarande pending. Aterkallade inbjudningar satts till now() med token=''revoked''.';
comment on column public.pending_invites.invited_by_admin_id is 'Admin som skapade inbjudan. SET NULL om admin-rad raderas (revisionsdata blir kvar men kopplingen slapps).';

-- Snabb-lookup vid send_otp / verify_otp samt admin_list_invites.
-- Partiell unique pa email sakrar att endast EN aktiv inbjudan per e-post finns.
create unique index if not exists pending_invites_email_active_uniq
  on public.pending_invites (lower(email))
  where accepted_at is null;

create index if not exists pending_invites_email_idx
  on public.pending_invites (lower(email))
  where accepted_at is null;

create index if not exists pending_invites_scope_idx
  on public.pending_invites (kommun_id, enhet_id)
  where accepted_at is null;

create index if not exists pending_invites_expires_idx
  on public.pending_invites (expires_at)
  where accepted_at is null;

-- RLS: helt stangd for anon + authenticated. Endast service_role (via vart
-- API med SUPABASE_SERVICE_KEY) far lasa/skriva. Inga policies = inget far
-- igenom nar RLS ar pa.
alter table public.pending_invites enable row level security;

revoke all on public.pending_invites from anon, authenticated;
grant  all on public.pending_invites to   service_role;
