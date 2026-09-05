-- ============================================================
-- The reads the site performs, one per section.
--
-- The whole page is one render, so these can also be run as a single
-- round trip — see "Everything at once" at the bottom, which returns one
-- JSON row and is what a statically generated page actually wants.
-- ============================================================

-- ── Hero ────────────────────────────────────────────────────
select name, short_name, role, location, email, phone,
       github_url, linkedin_url, tagline, bio, interests
from profile
where id = 1;

select label, value
from profile_facts
order by sort_order;


-- ── Work ────────────────────────────────────────────────────
-- The featured project renders as the large card.
select id, title, context, summary, detail, stack,
       is_team, repo_url, live_url
from projects
where is_featured
limit 1;

-- The rest, in display order.
select id, title, context, summary, detail, stack,
       is_team, repo_url, live_url
from projects
where not is_featured
order by sort_order, created_at;


-- ── Skills ──────────────────────────────────────────────────
-- Grouped in one query rather than N+1: the items come back as an ordered
-- array per group, which is the shape the component already renders.
select g.name  as group,
       g.note,
       coalesce(
         array_agg(s.name order by s.sort_order) filter (where s.id is not null),
         '{}'
       ) as items
from skill_groups g
left join skills s on s.group_id = g.id
group by g.id, g.name, g.note, g.sort_order
order by g.sort_order;


-- ── Education ───────────────────────────────────────────────
select e.degree, e.institution, e.location, e.period, e.status, e.note,
       coalesce(
         jsonb_agg(
           jsonb_build_object('label', r.label, 'value', r.value)
           order by r.sort_order
         ) filter (where r.id is not null),
         '[]'::jsonb
       ) as breakdown
from education e
left join education_results r on r.education_id = e.id
group by e.id, e.degree, e.institution, e.location, e.period, e.status, e.note, e.sort_order
order by e.sort_order;


-- ── Contact form ────────────────────────────────────────────
-- Parameterised. Never interpolate user input into SQL — this is the one
-- table on the site a stranger can write to.
insert into contact_messages (name, email, message, ip_hash)
values ($1, $2, $3, $4)
returning id, created_at;

-- Simple rate limit: refuse if this sender already wrote in the last minute.
select count(*) = 0 as allowed
from contact_messages
where ip_hash = $1
  and created_at > now() - interval '1 minute';

-- Your inbox. Needs the service-role key — RLS gives the anon key no read.
select id, name, email, message, created_at
from contact_messages
where not handled
order by created_at desc;


-- ============================================================
-- Everything at once
--
-- One round trip returning a single JSON document. For a page built at
-- deploy time, five separate queries is five network waits for content
-- that never changes between builds.
-- ============================================================
select jsonb_build_object(
  'profile', (select to_jsonb(p) from profile p where p.id = 1),

  'facts', (
    select coalesce(jsonb_agg(jsonb_build_object('label', label, 'value', value)
                              order by sort_order), '[]'::jsonb)
    from profile_facts
  ),

  'projects', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.is_featured desc,
                                                  x.sort_order), '[]'::jsonb)
    from (
      select id, title, context, summary, detail, stack,
             is_team, is_featured, repo_url, live_url, sort_order
      from projects
    ) x
  ),

  'skills', (
    select coalesce(jsonb_agg(jsonb_build_object(
             'group', g.name,
             'note',  g.note,
             'items', (select coalesce(array_agg(s.name order by s.sort_order), '{}')
                       from skills s where s.group_id = g.id)
           ) order by g.sort_order), '[]'::jsonb)
    from skill_groups g
  ),

  'education', (
    select coalesce(jsonb_agg(jsonb_build_object(
             'degree', e.degree, 'institution', e.institution,
             'location', e.location, 'period', e.period,
             'status', e.status, 'note', e.note,
             'breakdown', (
               select coalesce(jsonb_agg(jsonb_build_object('label', r.label,
                                                            'value', r.value)
                                         order by r.sort_order), '[]'::jsonb)
               from education_results r where r.education_id = e.id
             )
           ) order by e.sort_order), '[]'::jsonb)
    from education e
  )
) as site;
