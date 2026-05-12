-- =========================================================
-- ProTrack — initial schema
-- Arabic-first project tracking platform for contracting/engineering teams.
--
-- Run in Supabase SQL Editor (Dashboard → SQL → New query).
-- After running, see "Bootstrapping the first admin" at the bottom of this file.
-- =========================================================

-- Required extensions
create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================
do $$ begin
  create type role_t as enum ('admin','pm','engineer','finance','vendor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status_t as enum ('progress','review','risk','blocked','completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status_t as enum ('todo','progress','review','done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type term_status_t as enum ('planned','in_progress','done','on_hold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method_t as enum ('cash','bank_transfer','cheque','card');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status_t as enum ('paid','pending','overdue','draft');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status_t as enum ('active','invited','suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vendor_status_t as enum ('active','awaiting','prequalified','suspended');
exception when duplicate_object then null; end $$;

-- =========================================================
-- TABLE: users  (1:1 with auth.users)
-- Holds role + display profile. auth.users keeps the email/password.
-- =========================================================
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  display_name  text not null,
  initials      text not null default '··',
  color         text not null default 'var(--ink-700)',
  role          role_t not null default 'engineer',
  department    text,
  city          text,
  status        user_status_t not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =========================================================
-- TABLE: vendors
-- =========================================================
create table if not exists public.vendors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  discipline  text not null,
  status      vendor_status_t not null default 'awaiting',
  contact     text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =========================================================
-- TABLE: projects
-- =========================================================
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  discipline  text not null,
  status      project_status_t not null default 'progress',
  progress    int  not null default 0 check (progress between 0 and 100),
  budget      numeric(14,2) not null default 0,
  due_date    date,
  pm_id       uuid references public.users(id) on delete set null,
  client      text,
  location    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references public.users(id) on delete set null
);
create index if not exists idx_projects_pm on public.projects(pm_id);
create index if not exists idx_projects_status on public.projects(status);

-- =========================================================
-- TABLE: project_team  (which users are on each project)
-- =========================================================
create table if not exists public.project_team (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (project_id, user_id)
);
create index if not exists idx_project_team_user on public.project_team(user_id);

-- =========================================================
-- TABLE: terms (بنود المشروع)
-- =========================================================
create table if not exists public.terms (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  type        text not null,
  amount      numeric(14,2),
  start_date  date,
  end_date    date,
  status      term_status_t not null default 'planned',
  summary     text not null,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references public.users(id) on delete set null
);
create index if not exists idx_terms_project on public.terms(project_id);

-- =========================================================
-- TABLE: tasks
-- =========================================================
create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  code         text not null,
  title        text not null,
  status       task_status_t not null default 'todo',
  assignee_id  uuid references public.users(id) on delete set null,
  due_date     date,
  priority     text not null default 'normal',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references public.users(id) on delete set null
);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);

-- =========================================================
-- TABLE: expenses (مصروفات المشروع) — priority module
-- =========================================================
create table if not exists public.expenses (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  name            text not null,
  type            text not null,
  amount          numeric(14,2) not null,
  date            date not null,
  vendor_id       uuid references public.vendors(id) on delete set null,
  term_id         uuid references public.terms(id)   on delete set null,
  method          payment_method_t not null default 'bank_transfer',
  invoice_no      text,
  attachment_url  text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references public.users(id) on delete set null
);
create index if not exists idx_expenses_project on public.expenses(project_id);
create index if not exists idx_expenses_vendor on public.expenses(vendor_id);
create index if not exists idx_expenses_date on public.expenses(date);

-- =========================================================
-- TABLE: payments (vendor invoices)
-- =========================================================
create table if not exists public.payments (
  id          text primary key,           -- e.g. INV-08842
  project_id  uuid not null references public.projects(id) on delete cascade,
  vendor_id   uuid references public.vendors(id) on delete set null,
  amount      numeric(14,2) not null,
  status      payment_status_t not null default 'draft',
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_payments_project on public.payments(project_id);

-- =========================================================
-- TABLE: notifications  (per-user)
-- =========================================================
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  kind        text not null,
  title       text not null,
  body        text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, read);

-- =========================================================
-- TABLE: activity_log  (audit trail)
-- =========================================================
create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.users(id) on delete set null,
  verb        text not null,
  target      text not null,
  project_id  uuid references public.projects(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_activity_project on public.activity_log(project_id, created_at desc);

-- =========================================================
-- updated_at triggers
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$ declare t text;
begin
  for t in select unnest(array['users','vendors','projects','terms','tasks','expenses','payments'])
  loop
    execute format('drop trigger if exists trg_%I_updated on public.%I', t, t);
    execute format('create trigger trg_%I_updated before update on public.%I
                    for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- =========================================================
-- Auto-create public.users row when a new auth.users is inserted.
-- Default role = 'engineer'. Admin can change roles afterwards from the Users page.
-- =========================================================
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  full_name text := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1));
  ini text := coalesce(new.raw_user_meta_data->>'initials', upper(substr(full_name, 1, 2)));
begin
  insert into public.users (id, email, display_name, initials, role, status)
  values (new.id, new.email, full_name, ini, 'engineer', 'active')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- =========================================================
-- Helper functions for RLS
-- =========================================================
create or replace function public.current_role()
returns role_t language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.users where id = auth.uid()), false);
$$;

create or replace function public.is_admin_or_finance()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','finance') from public.users where id = auth.uid()), false);
$$;

create or replace function public.can_see_project(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select
    public.is_admin_or_finance()
    or exists (select 1 from public.projects   where id = p_id and pm_id = auth.uid())
    or exists (select 1 from public.project_team where project_id = p_id and user_id = auth.uid());
$$;

create or replace function public.can_modify_project(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
    or exists (select 1 from public.projects where id = p_id and pm_id = auth.uid());
$$;

-- =========================================================
-- Enable RLS on every table
-- =========================================================
alter table public.users           enable row level security;
alter table public.vendors         enable row level security;
alter table public.projects        enable row level security;
alter table public.project_team    enable row level security;
alter table public.terms           enable row level security;
alter table public.tasks           enable row level security;
alter table public.expenses        enable row level security;
alter table public.payments        enable row level security;
alter table public.notifications   enable row level security;
alter table public.activity_log    enable row level security;

-- =========================================================
-- POLICIES — users
-- Any authenticated user reads all profiles (needed for avatars/names).
-- Only admin inserts / updates / deletes.
-- (A user can update their own row's non-role fields via a dedicated policy.)
-- =========================================================
drop policy if exists users_select_all on public.users;
create policy users_select_all on public.users for select
  to authenticated using (true);

drop policy if exists users_admin_write on public.users;
create policy users_admin_write on public.users for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users for update
  to authenticated using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.users where id = auth.uid()));

-- =========================================================
-- POLICIES — vendors
-- =========================================================
drop policy if exists vendors_read on public.vendors;
create policy vendors_read on public.vendors for select
  to authenticated using (public.current_role() in ('admin','pm','finance','engineer'));

drop policy if exists vendors_write on public.vendors;
create policy vendors_write on public.vendors for all
  to authenticated using (public.is_admin_or_finance())
  with check (public.is_admin_or_finance());

-- =========================================================
-- POLICIES — projects
-- =========================================================
drop policy if exists projects_read on public.projects;
create policy projects_read on public.projects for select
  to authenticated using (public.can_see_project(id));

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert
  to authenticated with check (public.current_role() in ('admin','pm'));

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update
  to authenticated using (public.can_modify_project(id))
  with check (public.can_modify_project(id));

drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects for delete
  to authenticated using (public.is_admin());

-- =========================================================
-- POLICIES — project_team
-- =========================================================
drop policy if exists pteam_read on public.project_team;
create policy pteam_read on public.project_team for select
  to authenticated using (public.can_see_project(project_id));

drop policy if exists pteam_write on public.project_team;
create policy pteam_write on public.project_team for all
  to authenticated using (public.can_modify_project(project_id))
  with check (public.can_modify_project(project_id));

-- =========================================================
-- POLICIES — terms
-- =========================================================
drop policy if exists terms_read on public.terms;
create policy terms_read on public.terms for select
  to authenticated using (public.can_see_project(project_id));

drop policy if exists terms_write on public.terms;
create policy terms_write on public.terms for all
  to authenticated
  using (public.can_modify_project(project_id) or public.is_admin_or_finance())
  with check (public.can_modify_project(project_id) or public.is_admin_or_finance());

-- =========================================================
-- POLICIES — tasks
-- =========================================================
drop policy if exists tasks_read on public.tasks;
create policy tasks_read on public.tasks for select
  to authenticated using (public.can_see_project(project_id));

drop policy if exists tasks_write on public.tasks;
create policy tasks_write on public.tasks for all
  to authenticated
  using (
    public.can_modify_project(project_id)
    or (public.current_role() = 'engineer' and assignee_id = auth.uid())
  )
  with check (
    public.can_modify_project(project_id)
    or (public.current_role() = 'engineer' and assignee_id = auth.uid())
  );

-- =========================================================
-- POLICIES — expenses
-- =========================================================
drop policy if exists expenses_read on public.expenses;
create policy expenses_read on public.expenses for select
  to authenticated using (public.can_see_project(project_id));

drop policy if exists expenses_write on public.expenses;
create policy expenses_write on public.expenses for all
  to authenticated
  using (public.can_modify_project(project_id) or public.is_admin_or_finance())
  with check (public.can_modify_project(project_id) or public.is_admin_or_finance());

-- =========================================================
-- POLICIES — payments
-- =========================================================
drop policy if exists payments_read on public.payments;
create policy payments_read on public.payments for select
  to authenticated using (public.can_see_project(project_id));

drop policy if exists payments_write on public.payments;
create policy payments_write on public.payments for all
  to authenticated using (public.is_admin_or_finance())
  with check (public.is_admin_or_finance());

-- =========================================================
-- POLICIES — notifications (per user)
-- =========================================================
drop policy if exists notif_read on public.notifications;
create policy notif_read on public.notifications for select
  to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists notif_update on public.notifications;
create policy notif_update on public.notifications for update
  to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists notif_admin_write on public.notifications;
create policy notif_admin_write on public.notifications for insert
  to authenticated with check (public.is_admin());

drop policy if exists notif_admin_delete on public.notifications;
create policy notif_admin_delete on public.notifications for delete
  to authenticated using (public.is_admin() or user_id = auth.uid());

-- =========================================================
-- POLICIES — activity_log
-- Read: admin only. Insert: any authenticated (for logging from app).
-- =========================================================
drop policy if exists activity_read on public.activity_log;
create policy activity_read on public.activity_log for select
  to authenticated using (public.is_admin());

drop policy if exists activity_insert on public.activity_log;
create policy activity_insert on public.activity_log for insert
  to authenticated with check (actor_id = auth.uid());

-- =========================================================
-- Bootstrapping the first admin
-- ─────────────────────────────────────────────────────────
-- 1. Sign up via the ProTrack app sign-in page (or in Supabase Dashboard → Authentication → Add user).
-- 2. Your auth.users row triggers `handle_new_auth_user()` which creates
--    a public.users row with role='engineer'.
-- 3. Run THIS, replacing the email with yours, to promote yourself to admin:
--
--      update public.users
--      set role = 'admin', display_name = 'الاسم الكامل', initials = 'مع', department = 'الإدارة'
--      where email = 'your-email@example.com';
--
-- 4. Sign out and back in. You now have full access.
-- =========================================================
