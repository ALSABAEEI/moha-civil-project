-- =========================================================
-- ProTrack — disciplines lookup table (admin-managed)
-- Used to populate the discipline dropdown in Project and Vendor forms.
-- Stored as text in projects.discipline / vendors.discipline (no FK),
-- so removing an entry here does NOT break existing rows.
-- =========================================================

create table if not exists public.disciplines (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_disciplines_order on public.disciplines(display_order, name);

alter table public.disciplines enable row level security;

drop policy if exists disciplines_read on public.disciplines;
create policy disciplines_read on public.disciplines for select
  to authenticated using (true);

drop policy if exists disciplines_write on public.disciplines;
create policy disciplines_write on public.disciplines for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- Seed the standard discipline list
insert into public.disciplines (name, display_order) values
  ('مدني',         10),
  ('كهربائي',      20),
  ('ميكانيكي',     30),
  ('إنشاءات',      40),
  ('صيانة',        50),
  ('خدمة فنية',    60),
  ('توريد مواد',   70),
  ('أخرى',         99)
on conflict (name) do nothing;
