-- ============================================================
-- Seed — the site's current content, generated from
-- content/projects.json and lib/data.ts.
--
--   psql "$DATABASE_URL" -f db/seed.sql
--
-- Every statement is idempotent (on conflict / where not exists), so
-- re-running refreshes rather than duplicating.
-- ============================================================

begin;

-- ── profile ─────────────────────────────────────────────────
insert into profile (id, name, short_name, role, location, email, phone, github_url, linkedin_url, university, degree, cgpa, tagline, bio, interests)
values (1, 'Denusha Thavaruban', 'Denusha', 'Software Engineering Undergraduate', 'Sri Lanka', 'denushadenu12@gmail.com', '+94 75 371 7693', 'https://github.com/denusha1', 'https://linkedin.com/in/denushathavaruban', 'University of Moratuwa', 'BSc (Hons) in Information Technology & Management', '3.53 / 4.00', 'Third-year Information Technology & Management undergraduate at the University of Moratuwa, building full-stack web applications with React, Next.js, Node.js and REST APIs. Looking for a software engineering internship.', array['I''m a third-year Information Technology & Management undergraduate at the University of Moratuwa, currently at a 3.53 CGPA. Most of what I know about building software came from projects rather than lectures — designing the data model, writing the REST API, and then living with the frontend decisions I made two weeks earlier.', 'The work I''ve spent the most time on is a performance management system, where I owned the evaluation and approval workflow: the multi-level review chain, the status model underneath it, and the screens reviewers actually use. Alongside web development I''m working through data science and machine learning with NumPy, pandas and scikit-learn. I''m looking for an internship where I can keep building next to engineers who will tell me when I''m wrong.'], array['Data science & statistical analysis', 'AI, machine learning & data-driven problem solving'])
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  role = excluded.role,
  location = excluded.location,
  email = excluded.email,
  phone = excluded.phone,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url,
  university = excluded.university,
  degree = excluded.degree,
  cgpa = excluded.cgpa,
  tagline = excluded.tagline,
  bio = excluded.bio,
  interests = excluded.interests;

-- ── hero facts ──────────────────────────────────────────────
delete from profile_facts;
insert into profile_facts (label, value, sort_order) values
  ('Studying', 'BSc (Hons) IT & Management', 0),
  ('University', 'University of Moratuwa', 1),
  ('CGPA', '3.53 / 4.00', 2),
  ('Status', 'Seeking an internship', 3);

-- ── skills ──────────────────────────────────────────────────
delete from skills;
delete from skill_groups;
insert into skill_groups (name, note, sort_order) values
  ('Programming', null, 0),
  ('Frontend', null, 1),
  ('Backend', null, 2),
  ('Databases', null, 3),
  ('Cloud & DevOps', 'Kubernetes at a basic level', 4),
  ('Data & ML', null, 5),
  ('Tools & Design', null, 6);

insert into skills (group_id, name, sort_order)
select g.id, s.name, s.ord from skill_groups g
join (values
  ('Programming', 'JavaScript', 0),
  ('Programming', 'TypeScript', 1),
  ('Programming', 'Python', 2),
  ('Programming', 'Java', 3),
  ('Programming', 'C', 4),
  ('Frontend', 'React', 0),
  ('Frontend', 'Next.js', 1),
  ('Frontend', 'Angular', 2),
  ('Frontend', 'Tailwind CSS', 3),
  ('Backend', 'Node.js', 0),
  ('Backend', 'Express.js', 1),
  ('Backend', 'Spring Boot', 2),
  ('Backend', 'Ballerina', 3),
  ('Databases', 'MongoDB', 0),
  ('Databases', 'MySQL', 1),
  ('Databases', 'PostgreSQL', 2),
  ('Cloud & DevOps', 'AWS', 0),
  ('Cloud & DevOps', 'Docker', 1),
  ('Cloud & DevOps', 'Kubernetes', 2),
  ('Cloud & DevOps', 'Vercel', 3),
  ('Data & ML', 'NumPy', 0),
  ('Data & ML', 'pandas', 1),
  ('Data & ML', 'scikit-learn', 2),
  ('Data & ML', 'Matplotlib', 3),
  ('Data & ML', 'Plotly', 4),
  ('Tools & Design', 'Git & GitHub', 0),
  ('Tools & Design', 'VS Code', 1),
  ('Tools & Design', 'Jupyter Notebook', 2),
  ('Tools & Design', 'Figma', 3),
  ('Tools & Design', 'Photoshop', 4)
) as s(group_name, name, ord) on s.group_name = g.name;

-- ── projects (generated from content/projects.json) ─────────
insert into projects (id, title, context, summary, detail, stack, is_team, is_featured, sort_order, repo_url, live_url) values
  ('pms', 'Performance Management System', 'Team project · Full stack', 'A centralised platform for running employee performance evaluations through a multi-level organisational workflow. Each level reviews the level below it, and every evaluation moves through an approval chain before it counts.',
   array['Built the evaluation and approval workflow end to end — team management, employee evaluation, review, approval, rejection and status tracking.', 'Implemented the My Team view, with employee search, evaluation-status filtering and status-wise employee counts.', 'Built the evaluation interfaces covering performance objectives, targets, achievements, ratings, overall scores and feedback.', 'Implemented the multi-level approval and rejection flows, including reason and comment handling and the status updates that follow from them.', 'Developed the Enquiry and Notification modules for evaluation disputes and workflow updates.', 'Integrated the frontend with Flask REST APIs and Supabase PostgreSQL, with role-based access following the organisational hierarchy.'],
   array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python Flask', 'REST API', 'Supabase PostgreSQL', 'Azure AD SSO', 'LLM APIs'],
   true, true, 0, null, null),
  ('blogapp', 'BlogApp', 'Team project · Full stack', 'A blogging platform with dynamic post management, a Markdown editor that previews as you type, search across published posts, and profile administration.',
   array['Built the authentication engine: secure login and session management with role-based access.', 'Developed the Markdown editor, with live preview, formatting controls and draft saving.', 'Implemented the full post CRUD lifecycle — creation, inline editing and deletion behind confirmation modals.', 'Engineered post discovery with real-time text search and detailed post views.', 'Designed a personalised profile dashboard showing activity metrics and post management controls.'],
   array['Next.js', 'React', 'Node.js', 'REST APIs', 'Markdown parser', 'Tailwind CSS'],
   true, false, 1, null, null),
  ('cnc', 'CNC Paper Board Cutting Machine', 'Team project · Microcontroller', 'An automated CNC machine that cuts paper board from G-code, driven by an ESP32 coordinating stepper motors, servo motors and optical sensors.',
   array['Implemented the LCD operator interface and the servo motor control for machine operation.', 'Integrated and synchronised the paper feeding mechanism with the cutting process.', 'Designed the machine''s 3D components in Blender.'],
   array['ESP32', 'CNC Shield', 'NEMA 17', 'DRV8825', 'TCRT5000', 'GRBL', 'Inkscape', 'Blender'],
   true, false, 2, null, null)
on conflict (id) do update set
  title = excluded.title, context = excluded.context, summary = excluded.summary,
  detail = excluded.detail, stack = excluded.stack, is_team = excluded.is_team,
  is_featured = excluded.is_featured, sort_order = excluded.sort_order,
  repo_url = excluded.repo_url, live_url = excluded.live_url;

-- ── education ───────────────────────────────────────────────
delete from education_results;
delete from education;
insert into education (degree, institution, location, period, status, note, sort_order) values
  ('BSc (Hons) in Information Technology & Management', 'University of Moratuwa', 'Moratuwa, Sri Lanka', '2023 — Present', 'In progress', 'CGPA 3.53 / 4.00.', 0),
  ('GCE Advanced Level — Physical Science', 'J/Vembadi Girls'' High School', 'Jaffna, Sri Lanka', '2020 — 2022', 'Completed', 'Physical Science stream.', 1);

insert into education_results (education_id, label, value, sort_order)
select e.id, r.label, r.value, r.ord from education e
join (values
  ('BSc (Hons) in Information Technology & Management', 'Semester 1', '3.68', 0),
  ('BSc (Hons) in Information Technology & Management', 'Semester 2', '3.69', 1),
  ('BSc (Hons) in Information Technology & Management', 'Semester 3', '3.22', 2)
) as r(degree, label, value, ord) on r.degree = e.degree;

commit;
