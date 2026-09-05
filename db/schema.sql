-- ============================================================
-- Portfolio schema — PostgreSQL (written for Supabase)
--
-- Run in the Supabase SQL editor, or:
--   psql "$DATABASE_URL" -f db/schema.sql
--
-- Note: the "if not exists" clauses mean this will NOT fix a table that
-- already exists with different columns — it skips it silently. Run
-- db/reset.sql first if the tables were created any other way.
--
-- Design notes
--   * Short string lists (bio paragraphs, project bullets, tech stack) are
--     text[] rather than child tables. They are ordered, always read whole,
--     and never queried individually — a join table would add work and buy
--     nothing. Where a list has real structure (a label AND a value, its own
--     ordering) it gets a table: profile_facts, skills, education_results.
--   * Everything renders in a fixed order, so each table carries sort_order
--     instead of relying on insertion order, which Postgres does not promise.
--   * RLS is at the bottom and is not optional on Supabase — the anon key is
--     public, so without policies the whole database is world-writable.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── updated_at maintenance ──────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profile ─────────────────────────────────────────────────
-- Exactly one row. The check constraint on a fixed id is the usual way to
-- say "singleton" in SQL: a second insert collides on the primary key.
create table if not exists profile (
  id            smallint primary key default 1 check (id = 1),
  name          text not null,
  short_name    text not null,
  role          text not null,
  location      text not null,
  email         text not null,
  phone         text,
  github_url    text,
  linkedin_url  text,
  university    text,
  degree        text,
  cgpa          text,
  tagline       text not null,
  bio           text[] not null default '{}',
  interests     text[] not null default '{}',
  updated_at    timestamptz not null default now()
);

drop trigger if exists profile_set_updated_at on profile;
create trigger profile_set_updated_at
  before update on profile
  for each row execute function set_updated_at();

-- The four label/value pairs in the hero card.
create table if not exists profile_facts (
  id          bigint generated always as identity primary key,
  label       text not null,
  value       text not null,
  sort_order  integer not null default 0
);

-- ── skills ──────────────────────────────────────────────────
create table if not exists skill_groups (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  note        text,
  sort_order  integer not null default 0
);

create table if not exists skills (
  id          bigint generated always as identity primary key,
  group_id    bigint not null references skill_groups(id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0,
  unique (group_id, name)
);

create index if not exists skills_group_idx on skills (group_id, sort_order);

-- ── projects ────────────────────────────────────────────────
-- id stays a human-readable slug rather than a surrogate key: it is already
-- unique, it is what the URL fragment would use, and it makes the seed and
-- any hand-editing legible.
create table if not exists projects (
  id            text primary key check (id ~ '^[a-z0-9-]+$'),
  title         text not null check (length(trim(title)) > 0),
  context       text not null check (length(trim(context)) > 0),
  summary       text not null check (length(trim(summary)) > 0),
  detail        text[] not null default '{}',
  stack         text[] not null default '{}' check (cardinality(stack) > 0),
  is_team       boolean not null default false,
  is_featured   boolean not null default false,
  repo_url      text,
  live_url      text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- The site renders exactly one project as the large card. A partial unique
-- index makes a second featured row impossible at the database level, not
-- just in the API validator.
--
-- Caveat, stated because it matters: this enforces AT MOST one. Postgres
-- cannot express "exactly one" as a constraint — that needs a deferred
-- constraint trigger, or you keep the API's check for the zero case.
create unique index if not exists projects_one_featured
  on projects (is_featured) where is_featured;

create index if not exists projects_order_idx on projects (sort_order, created_at);

-- ── education ───────────────────────────────────────────────
create table if not exists education (
  id           bigint generated always as identity primary key,
  degree       text not null,
  institution  text not null,
  location     text,
  period       text not null,
  status       text not null,
  note         text,
  sort_order   integer not null default 0
);

-- Per-semester GPAs. A table rather than an array because each entry is a
-- label AND a value, and more semesters get added over time.
create table if not exists education_results (
  id            bigint generated always as identity primary key,
  education_id  bigint not null references education(id) on delete cascade,
  label         text not null,
  value         text not null,
  sort_order    integer not null default 0
);

create index if not exists education_results_idx
  on education_results (education_id, sort_order);

-- ── contact messages ────────────────────────────────────────
-- Only needed if you move the contact form off Formspree/mailto.
create table if not exists contact_messages (
  id          bigint generated always as identity primary key,
  name        text not null check (length(trim(name)) between 1 and 120),
  email       text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  message     text not null check (length(trim(message)) between 1 and 5000),
  -- Hashed, not raw: enough to rate-limit a sender, but the address itself
  -- is personal data you have no reason to keep.
  ip_hash     text,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on contact_messages (created_at desc);

-- ============================================================
-- Row Level Security
--
-- Supabase exposes the anon key in the browser. RLS is what stops that key
-- being a write credential for the whole database. Enable it on every table,
-- then grant back only what the public site needs.
-- ============================================================

alter table profile            enable row level security;
alter table profile_facts      enable row level security;
alter table skill_groups       enable row level security;
alter table skills             enable row level security;
alter table projects           enable row level security;
alter table education          enable row level security;
alter table education_results  enable row level security;
alter table contact_messages   enable row level security;

-- Public content: anyone may read, nobody may write through the anon key.
-- Edits go through the service-role key on the server, which bypasses RLS.
drop policy if exists "public read profile" on profile;
create policy "public read profile" on profile           for select using (true);
drop policy if exists "public read profile_facts" on profile_facts;
create policy "public read profile_facts" on profile_facts     for select using (true);
drop policy if exists "public read skill_groups" on skill_groups;
create policy "public read skill_groups" on skill_groups      for select using (true);
drop policy if exists "public read skills" on skills;
create policy "public read skills" on skills            for select using (true);
drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects          for select using (true);
drop policy if exists "public read education" on education;
create policy "public read education" on education         for select using (true);
drop policy if exists "public read education_results" on education_results;
create policy "public read education_results" on education_results for select using (true);

-- Contact form: visitors may insert, and deliberately may NOT select.
-- Without the asymmetry anyone could read every message ever sent to you.
drop policy if exists "anyone may send a message" on contact_messages;
create policy "anyone may send a message" on contact_messages for insert with check (true);

-- No select/update/delete policy for contact_messages: with RLS on and no
-- policy, the anon key cannot read them at all. Read them from the Supabase
-- dashboard or with the service-role key.
