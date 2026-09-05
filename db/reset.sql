-- ============================================================
-- Drops the portfolio tables so schema.sql can recreate them cleanly.
--
--   1. db/reset.sql   <- you are here
--   2. db/schema.sql
--   3. db/seed.sql
--
-- WHY THIS EXISTS
-- schema.sql uses "create table if not exists", which silently does nothing
-- when a table of that name already exists with different columns. If tables
-- were created by hand in the Supabase Table Editor first, schema.sql appears
-- to succeed while leaving the wrong shape in place — the failure only turns
-- up later as "column does not exist" or a type mismatch at query time.
--
-- THIS DELETES DATA. Safe when the tables are empty; check first if unsure:
--   select 'projects' t, count(*) from projects
--   union all select 'profile', count(*) from profile;
-- ============================================================

drop table if exists education_results cascade;
drop table if exists education         cascade;
drop table if exists skills            cascade;
drop table if exists skill_groups      cascade;
drop table if exists profile_facts     cascade;
drop table if exists projects          cascade;
drop table if exists profile           cascade;
drop table if exists contact_messages  cascade;

drop function if exists set_updated_at() cascade;
