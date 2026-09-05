# High‑Level Development Plan

**Project Type:** Multi‑page Portfolio Web Application (static‑site export with optional serverless backend)

---

## 1. Technology Selection

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend Framework** | **React** (with **Vite**) | Component‑based UI, fast HMR, easy TypeScript integration, and builds to static assets.
| **Static Site Generator / SSR** | **Next.js (static export)** *optional* | Provides built‑in SEO‑friendly routing and static generation; can be swapped with plain Vite if preferred.
| **Styling** | **TailwindCSS** | Utility‑first, responsive design, minimal CSS bloat, aligns with WCAG AA contrast requirements.
| **Language** | **TypeScript** (target ES2022) | Static typing improves maintainability and catches errors early.
| **Build Tools** | **Vite**, **ESLint**, **Prettier** | Fast bundling, consistent code style, linting for quality.
| **Backend / API** | **Express.js** (Node.js) hosted as **Netlify Functions** | Lightweight routing for contact form, admin authentication, CRUD operations; fits static‑site deployment model.
| **Data Persistence** | **lowdb** (JSON file) | Simple file‑based storage, no external DB required, sufficient for a single‑admin portfolio.
| **Email Service** | **Nodemailer** with SMTP **or** third‑party API (SendGrid) | Handles contact form submissions securely.
| **Authentication** | **bcrypt** for password hashing, **JSON Web Tokens (JWT)** stored in HttpOnly cookies | Secure admin login, CSRF protection via same‑site cookies.
| **Hosting** | **Netlify** (static hosting + Functions) | Free CDN, HTTPS, continuous deployment from Git, built‑in form handling fallback.
| **Version Control** | **Git** (GitHub repo) | Collaboration, CI/CD triggers.
| **Testing / Validation** | **Jest** + **React Testing Library** (unit/component), **Cypress** (e2e) | Guarantees functional correctness.
| **Accessibility** | **eslint-plugin-jsx-a11y**, manual WCAG AA audit | Meets accessibility requirements.

> All decisions above have been recorded in project memory (see `workspace/memory`).

---

## 2. Major Components

1. **Landing / Home Page**
   - Hero section, brief intro, navigation.
   - Featured project carousel (optional).
2. **Projects List Page** (`/projects`)
   - Grid of project cards (thumbnail, title, tags).
3. **Project Detail Page** (`/projects/:slug`)
   - Image gallery, full description, external links.
4. **About Page** (`/about`)
   - Biography, skills list, downloadable resume.
5. **Contact Page / Form** (`/contact`)
   - Client‑side validation, submission to API.
6. **Admin Dashboard** (`/admin`)
   - **Login** (`/admin/login`)
   - **Project Management** (CRUD UI, optimistic updates)
   - **About / Resume Management**
   - **Contact Submissions Viewer** (optional).
7. **API Layer** (Netlify Functions)
   - `POST /api/contact` – send email.
   - `POST /api/auth/login` – issue JWT.
   - `GET/POST/PUT/DELETE /api/projects` – CRUD.
   - `GET/PUT /api/about` – fetch/update bio & resume.
8. **Shared UI Components**
   - Header/Nav, Footer, Card, Modal, Toast, Loading Spinner.
9. **Error Pages**
   - Custom 404 and 500 pages.
10. **Utilities**
    - SEO helper (React Helmet / Next Head), route guard HOC, API client wrapper, form validation schema (Yup/Zod).

---

## 3. Development Tasks (by Phase)

### Phase 1 – Project Setup & Core Architecture
- [ ] Initialise Git repository and set up CI (GitHub Actions) for lint/test builds.
- [ ] Scaffold React app with Vite (TypeScript template).
- [ ] Add TailwindCSS configuration (postcss, autoprefixer).
- [ ] Configure ESLint + Prettier with TypeScript support.
- [ ] Create folder structure: `src/components`, `src/pages`, `src/api`, `src/utils`.
- [ ] Set up Netlify configuration (`netlify.toml`) for redirects and functions.
- [ ] Implement basic routing (React Router or Next.js pages) with SEO‑friendly URLs.
- [ ] Add global layout (Header, Footer) and responsive grid system.

### Phase 2 – Public UI Development
- **Home Page**: hero, navigation, featured projects placeholder.
- **Projects List**: fetch static project data (JSON) and render grid cards.
- **Project Detail**: dynamic route, display images and links.
- **About Page**: bio, skills list, resume download button.
- **Contact Form**: UI with validation (Yup/Zod), toast notifications.
- **Error Pages**: 404 and 500 designs.
- **Responsive & Accessibility**: test breakpoints (desktop, tablet, mobile) and WCAG AA contrast.

### Phase 3 – Backend / Serverless API
- [ ] Add Express.js to `functions` folder, configure Netlify Functions wrapper.
- [ ] Implement `POST /api/contact` – validate payload, send email via Nodemailer or SendGrid.
- [ ] Set up `lowdb` JSON store (`data/db.json`) with schema for projects and about content.
- [ ] Implement authentication routes (`/api/auth/login`) using bcrypt hashed passwords stored in `data/users.json`.
- [ ] Secure routes with JWT middleware and CSRF token checks.
- [ ] CRUD endpoints for projects and about data.
- [ ] Add rate‑limiting / basic security headers (helmet).

### Phase 4 – Admin Interface
- **Login Page**: form, JWT handling, protected route guard.
- **Dashboard Layout**: sidebar navigation.
- **Project Management UI**: list, add/edit modal, delete confirmation, optimistic UI updates.
- **About / Resume Editor**: rich‑text textarea for bio, file upload component for resume PDF.
- **Contact Submissions Viewer** (optional): list received messages.
- **Logout**: clear JWT cookie.

### Phase 5 – SEO, Performance & Testing
- [ ] Add meta tags, Open Graph, sitemap.xml generation.
- [ ] Optimize images (next‑gen formats, lazy loading).
- [ ] Configure Vite build for code‑splitting and asset hashing.
- [ ] Run Lighthouse audit – target ≤2 s on 3G.
- [ ] Write unit tests for utility functions and components.
- [ ] Write e2e tests covering visitor flow and admin CRUD.
- [ ] Set up CI pipeline to run lint, tests, and build on every PR.

### Phase 6 – Deployment & Post‑Launch
- [ ] Connect repository to Netlify for automatic deploys.
- [ ] Set environment variables (SMTP credentials, JWT secret).
- [ ] Verify Netlify Functions are correctly bundled and reachable.
- [ ] Perform final accessibility audit (axe, manual checks).
- [ ] Create documentation (`README.md`) with setup, dev, build, and deployment instructions.
- [ ] Deliver source code (public GitHub repo) and hand‑off notes.

---

## 4. Milestones & Timeline (Suggested)
| Milestone | Target Completion |
|-----------|--------------------|
| Project scaffolding & CI | Week 1 |
| Public UI (home, projects, about, contact) | Week 2 |
| Serverless API & data store | Week 3 |
| Admin dashboard (CRUD) | Week 4 |
| Testing, SEO, performance tuning | Week 5 |
| Deployment to Netlify & final QA | Week 6 |
| Handover & documentation | End of Week 6 |

---

**End of Plan**
