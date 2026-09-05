# Technical Architecture Document

**Generated on:** 2026-09-02

---

## 1. Project Directory Tree

```
workspace/
├─ .gitignore                     # Standard Git ignore patterns
├─ README.md                      # Project overview, setup, and deployment instructions
├─ netlify/
│   └─ netlify.toml               # Netlify configuration (redirects, functions)
├─ docs/
│   ├─ requirements.md            # Full requirement specification (provided)
│   └─ architecture.md             # **This file** – detailed architecture
├─ src/
│   ├─ frontend/                  # React + Vite front‑end source
│   │   ├─ package.json            # NPM dependencies & scripts
│   │   ├─ tsconfig.json           # TypeScript configuration
│   │   ├─ vite.config.ts          # Vite build configuration
│   │   ├─ tailwind.config.cjs     # TailwindCSS config
│   │   ├─ postcss.config.cjs      # PostCSS (Tailwind) config
│   │   ├─ index.html              # HTML entry point
│   │   └─ src/                    # Application source code
│   │       ├─ main.tsx            # React entry point – renders <App />
│   │       ├─ App.tsx             # Root component – layout & router
│   │       ├─ routes/             # Page‑level components (one file per route)
│   │       │   ├─ Home.tsx
│   │       │   ├─ Projects.tsx
│   │       │   ├─ ProjectDetail.tsx
│   │       │   ├─ About.tsx
│   │       │   ├─ Contact.tsx
│   │       │   └─ Admin/
│   │       │       ├─ Login.tsx
│   │       │       ├─ Dashboard.tsx
│   │       │       ├─ ProjectManager.tsx
│   │       │       └─ AboutEditor.tsx
│   │       ├─ components/          # Re‑usable UI pieces
│   │       │   ├─ Header.tsx
│   │       │   ├─ Footer.tsx
│   │       │   ├─ ProjectCard.tsx
│   │       │   ├─ Modal.tsx
│   │       │   ├─ Toast.tsx
│   │       │   ├─ LoadingSpinner.tsx
│   │       │   ├─ Input.tsx
│   │       │   └─ TextArea.tsx
│   │       ├─ utils/               # Helper modules used across the UI
│   │       │   ├─ apiClient.ts      # Axios wrapper for calling FastAPI endpoints
│   │       │   ├─ authGuard.ts      # Higher‑order component protecting admin routes
│   │       │   ├─ validation.ts     # Yup/Zod schemas for form validation
│   │       │   ├─ seo.ts            # React‑Helmet helpers for meta tags
│   │       │   └─ types.ts          # Shared TypeScript types/interfaces
│   │       └─ assets/               # Static assets (images, placeholder resume)
│   │           ├─ images/
│   │           └─ resume.pdf
│   └─ backend/                    # FastAPI serverless API (Netlify Functions)
│       ├─ requirements.txt       # Python dependencies
│       ├─ .env.example            # Example environment variables (SMTP, JWT secret)
│       ├─ Dockerfile              # Optional container for local dev/testing
│       ├─ app/
│       │   ├─ main.py             # FastAPI app entry point – includes routers & middleware
│       │   ├─ core/
│       │   │   ├─ config.py       # Pydantic settings (env vars)
│       │   │   ├─ security.py    # Password hashing, JWT creation/verification
│       │   │   └─ dependencies.py # FastAPI dependency injection (e.g., DB instance)
│       │   ├─ models/
│       │   │   ├─ project.py      # TinyDB model wrappers for a Project
│       │   │   ├─ about.py        # Model for About page content
│       │   │   └─ user.py         # Admin user model (email, hashed password)
│       │   ├─ schemas/
│       │   │   ├─ project_schema.py   # Pydantic schema for request/response validation
│       │   │   ├─ about_schema.py
│       │   │   ├─ user_schema.py
│       │   │   └─ contact_schema.py
│       │   ├─ routers/
│       │   │   ├─ auth.py          # /api/auth/* – login, token refresh
│       │   │   ├─ projects.py      # CRUD endpoints for /api/projects
│       │   │   ├─ about.py         # GET/PUT for /api/about
│       │   │   └─ contact.py       # POST /api/contact – send email
│       │   └─ utils/
│       │       ├─ email_sender.py # Wrapper around aiosmtplib / SendGrid SDK
│       │       └─ db.py           # TinyDB initialisation & helper functions
│       └─ tests/
│           ├─ test_auth.py
│           ├─ test_projects.py
│           ├─ test_about.py
│           └─ test_contact.py
├─ .eslintrc.cjs                  # ESLint configuration for TypeScript/React
├─ .prettierrc                    # Prettier formatting rules
├─ jest.config.ts                  # Jest configuration for unit tests
└─ cypress/
    └─ integration/
        ├─ visitor_flow.spec.ts   # End‑to‑end tests for public UI
        └─ admin_flow.spec.ts     # End‑to‑end tests for admin CRUD
```

*Each file path is relative to the `workspace/` root.*

---

## 2. Component Relationships

### Front‑end (React)
| Component / Module | Imports / Calls |
|---------------------|-----------------|
| `App.tsx` | Imports `Header`, `Footer`, and all route components from `routes/`; uses `react-router-dom` `<BrowserRouter>`.
| `Header.tsx` | Imports navigation links, uses `authGuard` to conditionally show admin links.
| Route pages (`Home.tsx`, `Projects.tsx`, `ProjectDetail.tsx`, `About.tsx`, `Contact.tsx`) | Import shared UI components (`ProjectCard`, `Modal`, `Toast`, etc.) and utility functions (`apiClient`, `validation`).
| `Contact.tsx` | Uses `validation` schema for client‑side checks, calls `apiClient.post('/api/contact', payload)`, shows `Toast` on success/failure.
| `Admin/Login.tsx` | Calls `apiClient.post('/api/auth/login')`; on success stores JWT in HttpOnly cookie via `authGuard`.
| `Admin/Dashboard.tsx` | Wrapped by `authGuard` – only renders if valid JWT present.
| `Admin/ProjectManager.tsx` | Calls CRUD helpers from `apiClient` (`GET /api/projects`, `POST`, `PUT`, `DELETE`). Updates UI optimistically.
| `Admin/AboutEditor.tsx` | Calls `apiClient.get('/api/about')` and `apiClient.put('/api/about')`; uploads resume via `FormData` to `apiClient.put`.
| `utils/apiClient.ts` | Centralised Axios instance with base URL pointing to Netlify Functions (`/.netlify/functions/...`). Handles JWT token inclusion and error handling.
| `utils/authGuard.ts` | Higher‑order component that reads the HttpOnly JWT cookie, verifies it via a lightweight client‑side check (optional) and redirects to `/admin/login` if absent.
| `utils/validation.ts` | Exports Yup/Zod schemas used by both public forms and admin forms.
| `utils/seo.ts` | Supplies React‑Helmet `<Helmet>` props for each page (title, description, OG tags).

### Back‑end (FastAPI)
| Module | Imports / Calls |
|--------|-----------------|
| `app/main.py` | Imports FastAPI, routers (`auth`, `projects`, `about`, `contact`), middleware (`CORSMiddleware`, custom JWT middleware), and dependency provider (`core.dependencies.get_db`).
| `core/config.py` | Loads environment variables via `pydantic.BaseSettings`.
| `core/security.py` | Imports `passlib.context.CryptContext` for bcrypt hashing, `python-jose` for JWT creation/verification, and `datetime` utilities.
| `core/dependencies.py` | Provides `get_db` that returns a TinyDB instance (`utils.db.get_db`).
| `utils/db.py` | Initialises TinyDB (`TinyDB('data/db.json')`), creates tables for `projects`, `about`, `users`.
| `models/*.py` | Thin wrappers around TinyDB tables; expose CRUD helper methods used by routers.
| `schemas/*.py` | Pydantic models for request validation and response shaping.
| `routers/auth.py` | Uses `security.verify_password`, `security.create_access_token`, reads `users` table via DB dependency, returns JWT in HttpOnly cookie.
| `routers/projects.py` | CRUD endpoints (`GET /api/projects`, `POST`, `PUT /api/projects/{id}`, `DELETE`). Each handler validates payload against `project_schema`, then calls model methods.
| `routers/about.py` | `GET /api/about` returns current bio/resume metadata; `PUT` updates content and optionally stores uploaded resume file using `aiofiles`.
| `routers/contact.py` | Validates payload (`contact_schema`), then calls `utils.email_sender.send_email` (SMTP or SendGrid). Returns 200 on success, raises 500 on failure.
| `utils/email_sender.py` | Uses `aiosmtplib` (or `sendgrid` SDK) to send email; reads SMTP credentials from `config`.

### Interaction Flow
1. **Visitor** loads React app → route components fetch public data via `apiClient` (GET `/api/projects`, `/api/about`).
2. **Contact form** posts to `/api/contact`; FastAPI validates, sends email, returns status.
3. **Admin login** posts credentials to `/api/auth/login`; FastAPI verifies password with bcrypt, returns JWT cookie.
4. **Authenticated admin** pages include `authGuard`; subsequent API calls include JWT cookie, FastAPI middleware validates token before allowing access to protected routers (`/api/projects/*`, `/api/about`).
5. **CRUD actions** modify TinyDB JSON file (`data/db.json`) via model helpers; changes are instantly reflected when the front‑end refetches data.

---

## 3. Dependency List

### Front‑end (`workspace/src/frontend/package.json` excerpt)
```json
{
  "name": "portfolio-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "test": "jest",
    "cypress": "cypress open"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "@headlessui/react": "^1.7.15",
    "@heroicons/react": "^2.0.18",
    "zod": "^3.22.4",
    "react-helmet-async": "^1.3.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^4.4.9",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.48.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "prettier": "^3.0.3",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.2.0",
    "cypress": "^13.4.0"
  }
}
```

### Back‑end (`workspace/src/backend/requirements.txt`)
```
fastapi==0.110.0
uvicorn[standard]==0.27.0.post1
python-multipart==0.0.9
pydantic==2.5.3
python-dotenv==1.0.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
tinydb==4.8.0
aiofiles==23.2.1
aiosmtplib==2.0.2   # optional – SMTP email sending
# If using SendGrid instead of SMTP, replace aiosmtplib with:
# sendgrid==6.11.0
```

---

## 4. Rationale for Architecture Decisions (recorded)
- **Frontend** uses **React + Vite + TypeScript** for a modern component‑based UI, fast hot‑module replacement, and static‑site generation compatibility.
- **Styling** with **TailwindCSS** satisfies responsive design and WCAG AA contrast requirements while keeping CSS bundle size low.
- **Backend** is **FastAPI (Python)** because a prior decision selected *Python 3.10+ with FastAPI* for the API layer. FastAPI provides async performance, automatic OpenAPI docs, and integrates cleanly with TinyDB.
- **Data persistence** is handled by **TinyDB** (Python) – a lightweight JSON‑file database that mirrors the earlier *lowdb* decision but aligns with the Python backend.
- **Authentication** employs **bcrypt** for password hashing and **JWT** stored in HttpOnly cookies, meeting security non‑functional requirements.
- **Email** is sent via **aiosmtplib** or a third‑party API (SendGrid) to satisfy the contact‑form requirement.
- **Netlify Functions** host the FastAPI application as a serverless backend, enabling a fully static front‑end deployment with optional dynamic endpoints.
- **Testing** stack (Jest + React Testing Library for unit/component tests, Cypress for end‑to‑end) ensures reliability and meets the testing mandate.
- **CI/CD** (GitHub Actions – not shown in the tree) will run linting, type‑checking, tests, and a production build on every push.

---

## 5. Next Steps
1. Run `npm install` inside `src/frontend` and `pip install -r src/backend/requirements.txt` inside `src/backend`.
2. Initialise the TinyDB file (`src/backend/data/db.json`) with an admin user (hashed password) – can be done via a one‑off script.
3. Configure `.env` with SMTP credentials, JWT secret, and any Netlify environment variables.
4. Execute `npm run dev` and `uvicorn src.backend.app.main:app --reload` to start local development servers.
5. Implement the components/pages outlined above, then progress through the phases described in the development plan.

---

*Document created by the Architect (ChatGPT) based on the development plan and recorded project decisions.*
