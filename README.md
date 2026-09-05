# Portfolio — Denusha Thavaruban

Personal portfolio site. Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Before you deploy

All copy lives in [`lib/data.ts`](lib/data.ts) — nothing is hard-coded into components.
Search that file for `TODO` and replace every placeholder:

| What | Where | Notes |
| --- | --- | --- |
| Résumé PDF | `public/cv.pdf` | The header, hero and command palette all link here. **Not added yet** — add the file or remove those links. |
| Project repo links | `repo` on the PMS and BlogApp entries | The CV links Git repos for both; paste the URLs to show a Source link. |
| Production URL | `metadataBase` in `app/layout.tsx`, `BASE_URL` in `app/sitemap.ts` | Used for canonical URLs, Open Graph and the sitemap. |


### Contact form

The form posts to [Formspree](https://formspree.io) when `NEXT_PUBLIC_FORMSPREE_ID`
is set (copy `.env.local.example` to `.env.local`). Without it, submitting opens the
visitor's mail client with the message prefilled — it never claims to have sent
something it didn't.

### Icons and the share card

`app/favicon.ico`, `app/apple-icon.png` and `app/opengraph-image.png` are generated,
not hand-drawn. Rebuild the share card after changing the name, role or photo:

```bash
python scripts/make-og-image.py
```

Next.js picks all three up by file convention — no metadata wiring needed.

### Colour contrast

Every text token clears WCAG AA (4.5:1) against every background it sits on, in
both themes. `--text-3` is the tight one at ~4.7:1, so if you lighten it, check it.

## Adding a project

Projects live in `content/projects.json`, and there is a small editor for them:

```bash
npm run dev
# then open http://localhost:3000/admin
```

You'll be asked for a password. It defaults to **`sinthu`**; set `ADMIN_PASSWORD`
in `.env.local` to change it (`.env*` is gitignored).

Add, edit, reorder or delete, then **Save**. The editor PUTs to `/api/projects`,
which validates the payload and rewrites the JSON; the dev server hot-reloads the
site with the new content. **Commit `content/projects.json` to publish it.**

Both `/admin` and `/api/projects` return 404 when `NODE_ENV=production`. The
deployed site is statically prerendered on a read-only filesystem, so writing
there could not work anyway — and an unauthenticated endpoint that rewrites site
content has no business being on a public URL. Editing the live site from a
browser would need a database and a login, which is a much bigger change.

### How the gate works

The password is compared **server-side** — it never reaches the browser, so it
can't be read out of the bundle or stepped over in devtools. On success the
server sets an httpOnly cookie holding an expiry plus an HMAC of it, signed with
a key derived from the password. Changing `ADMIN_PASSWORD` therefore invalidates
every outstanding session immediately.

The session is checked in two places, not one: `/admin` decides what to render,
and `/api/projects` re-checks on every request. An API that trusted the page
would still accept a direct request from anything that can reach the port.

The token is signed rather than stored in memory. A module-level `Set` looks
like the obvious approach and does not work here — Next bundles route handlers
and server components separately, so logging in populates a different instance
than the page reads, and the gate never opens even though the API accepts the
same cookie.

**This is not protection for a public URL.** It guards the editor on your own
machine. `/admin` and both API routes 404 under `NODE_ENV=production`.

Validation rejects a save outright (nothing is written) if any project is missing
`id`/`title`/`context`/`summary`, an id is not lowercase-and-hyphens or is
duplicated, a project has no stack entries, or the number of featured projects is
not exactly one.

## Database (Supabase)

The site reads content from Supabase when it is configured and has rows, and
falls back to `lib/data.ts` / `content/projects.json` otherwise. That fallback
is load-bearing: a fresh clone with no `.env.local`, a schema that has not been
seeded yet, or Supabase being unreachable mid-deploy all still render a correct
site instead of a blank one. Every fallback logs a `[content]` line during
`next build`, so a misconfiguration is visible rather than silent.

### Setting it up

In the Supabase SQL editor, run in this order:

```
db/reset.sql    -- only if the tables already exist in some other shape
db/schema.sql   -- tables, constraints, indexes, RLS
db/seed.sql     -- the current content
```

Then in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
```

Both must start with `NEXT_PUBLIC_`, and env var names cannot contain spaces —
a name like `supabasePublishable key` is silently never read. The anon key is
meant to be public; RLS is what protects the data. A `service_role`/secret key
must never go in a `NEXT_PUBLIC_` variable.

### Order matters

`schema.sql` uses `create table if not exists`, so it does **nothing** to a
table that already exists with different columns — it skips it without error,
and the mismatch only shows up later as `column ... does not exist`. If the
tables were created any other way (the Supabase Table Editor, for instance),
run `db/reset.sql` first. It drops them, so check they are empty.

| file | what it is |
| --- | --- |
| `db/schema.sql` | 8 tables, constraints, indexes, `updated_at` triggers, RLS policies |
| `db/seed.sql` | current content, generated from the real data; idempotent |
| `db/queries.sql` | the reads each section needs, plus a single-round-trip version |

Three decisions worth knowing:

- **Short string lists stay as `text[]`** (bio paragraphs, project bullets, tech
  stack). They are ordered, always read whole and never queried individually, so
  a join table would add work and buy nothing. Lists with real structure — a
  label *and* a value — get tables: `profile_facts`, `skills`, `education_results`.
- **One featured project is enforced by a partial unique index**, not just the
  API validator. Note it enforces *at most* one; Postgres cannot express
  "exactly one" as a constraint, so the API keeps the zero case.
- **RLS is not optional on Supabase.** The anon key ships to the browser, so
  without policies it is a write credential for the whole database. Content
  tables are public-read only. `contact_messages` is insert-only with **no**
  select policy — otherwise any visitor could read every message ever sent to
  you. Writes go through the service-role key on the server.

Nothing in the app reads these tables yet; wiring it up is a separate step.

## Structure

```
app/
  layout.tsx      fonts, metadata, no-flash theme script
  page.tsx        section order
  globals.css     design tokens + the small set of shared classes
components/       one file per section, plus Reveal / SectionHeading primitives
lib/data.ts       all content
```

The design system is deliberately small: a neutral colour ramp, five section hues,
one entrance animation (`components/Reveal.tsx`), and a shared section header.
Adding a new section means writing content in `lib/data.ts` and reusing those
primitives — not inventing a new visual language.

### Motion

`components/MotionProvider.tsx` wraps the app in `MotionConfig reducedMotion="user"`.
This matters: the `prefers-reduced-motion` block in `globals.css` only stops CSS
animations, and Framer Motion writes transforms directly to the element, so without
it none of the reveals or parallax would honour the setting.

### Glass

`.glass` is applied to the four surfaces that actually have something behind
them — the header once scrolled, the hero facts card over the aurora, the
command palette and the mobile sheet. On a plain section background it would be
a flat panel with a `backdrop-filter` cost and nothing to show for it.

The rule is wrapped in `@supports (backdrop-filter)`. Without that guard, a
browser lacking `backdrop-filter` would apply the translucent background on its
own and drop text straight onto whatever is behind it; the fallback keeps the
solid `--surface`. The tints are deliberately close to `--surface` so the blur
is what reads, and so the text contrast every token was tuned for survives —
the tightest case composites to 4.6:1, still AA.

### View transitions

Clicking a nav link scrolls instantly, then a View Transition cross-fades the
before and after so arriving reads as a page change rather than a jump cut.

The theme toggle uses the same API for its circular reveal, and both animate
`::view-transition-*(root)` — there is only one root. `lib/view-transition.ts`
stamps `data-vt="nav"` or `data-vt="theme"` on `<html>` for the duration, and the
CSS keys off it. Without that scoping, jumping to a section inherits the theme
toggle's circular clip and wipes out from wherever the toggle happens to sit.

The `<header>` gets its own `view-transition-name`, so it stays put instead of
riding along with the page.

Unsupported browsers (Firefox, older Safari) and anyone with reduced motion get
the plain instant jump.

### color-mix() and Lightning CSS

Lightning CSS compiles `color-mix()` into a plain fallback plus a `@supports`
override — and the fallback is the *solid* colour. Firefox only shipped `color-mix`
in 113, which is inside Next 16's stated browser support, so check what a rule
degrades into before using it. Where the solid fallback would look broken (the
pointer spotlight, the portrait ring, tag hover backgrounds) the effect is built
from `opacity` or an explicit `--*-soft` token instead.

## Content rules

Four things this site does not do, on purpose:

- **No invented content.** No fabricated testimonials, blog posts or achievements.
  Anything attributed to a named person must be something they actually said.
- **No self-assigned skill percentages.** Skills are grouped by what they're used
  for. "React 88%" is not information a reader can act on.
- **Team projects say so.** Every project on the site was built with others, so
  each one carries a "My contribution" heading over its bullets rather than
  implying sole authorship.
- **No referee contact details.** The CV lists two lecturers with their phone
  numbers and personal emails. Publishing those on a public page exposes their
  data without their consent — offer references on request instead.

## Notes

The repository root also contains unrelated Python files (`stringkit/`, `src/`,
`workspace/`, `tests/`) from other work. They're excluded in `tsconfig.json` and
`eslint.config.mjs` so they don't break builds, but they don't belong here and are
worth moving out.
