# Hand‑over Document – Eunice Admissions Platform (to Claude Code)

## ✅ Current Project Status

| Area | Details |
|------|---------|
| **Repository** | `/Users/brandondienar/Documents/Codex/Projects/Eunice` – Next.js 16 (App Router) with TypeScript, Tailwind CSS, and a custom design system (primary/indigo/neutral palette, glass‑morphism). |
| **Front‑end scaffolding** | - `src/app/layout.tsx` with global gradient background and `<NavBar />`.
- Reusable UI components (`Button`, `Input`, `Card`).
- Placeholder pages:
  - `/parent` – *Parent Portal – Coming Soon*.
  - `/admin` – *Admin Dashboard – Coming Soon*.
- Navigation bar (`src/components/ui/nav.tsx`) linking to those routes.
| **Supabase integration** | - `.env.local` contains:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://pjtmdiencpoguxasnyqx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__UDHmTFy5BMGYrfX5UafsA_3FhueacP
  SUPABASE_DB_URL=postgresql://postgres:<YOUR_PASSWORD>@db.pjtmdiencpoguxasnyqx.supabase.co:5432/postgres
  SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>   # optional, for server‑side actions
  ```
- Supabase CLI linked to project (`supabase link --project-ref pjtmdiencpoguxasnyqx`).
- Migration `20260519000000_init_multi_tenant_schema.sql` pushed (`supabase db push`).
| **Development environment** | Local dev server running at `http://localhost:3000` (Next.js dev mode). |

## 🛑 Outstanding Challenges / Open Tasks

1. **Route Conflict Resolution**
   - The original `(admin)` and `(parent)` parallel route folders caused a duplicate‑page error. The fix is to rename them to `admin` and `parent` (or nest under a common `(dashboard)` parent). Ensure the final folder structure matches the routes used in `<NavBar />`.
2. **Database Password & Service‑Role Key**
   - The `.env.local` file still contains placeholder `<YOUR_PASSWORD>` and optionally `<YOUR_SERVICE_ROLE_KEY>`. These must be replaced with the actual values from Supabase (Database Settings → Password, Settings → API → `service_role`).
3. **Authentication Flow**
   - Implement sign‑up / sign‑in pages (`/auth/signup`, `/auth/signin`).
   - Store user role (`parent`, `admin`, `superadmin`) in the `profiles` table on sign‑up.
4. **Middleware for Role‑Based Access**
   - Create `src/middleware.ts` to guard `/parent/*` for `parent` role and `/admin/*` for `admin`/`superadmin` roles, redirecting unauthenticated or unauthorized users.
5. **First Functional Application Form**
   - Build a draft‑creation page (e.g., `/parent/apply`) that inserts a row into the `applications` table (using the Supabase client).
   - Utilize the reusable UI components (`Card`, `Input`, `Button`).
6. **Testing & QA**
   - Verify the `/api/ping` endpoint returns data correctly after the password is set.
   - Run `npm run lint` / `npm run format` to ensure code quality.
7. **Deployment Prep**
   - Add Vercel environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
   - Consider adding a GitHub Actions workflow for automated Supabase migrations on deploy.

## 📅 Suggested Next Steps for Claude Code

1. **Finalize the folder rename** (`(admin)` → `admin`, `(parent)` → `parent`) and ensure `src/app/layout.tsx` imports the NavBar correctly.
2. **Replace placeholders** in `src/.env.local` with the real Supabase DB password and service‑role key.
3. **Run**:
   ```bash
   supabase db push
   cd src && npm run dev
   ```
   Confirm the app loads without route errors.
4. **Implement authentication** (sign‑up / sign‑in) and store the role in `profiles`.
5. **Add middleware** for role‑based protection.
6. **Create the first step of the application form** leveraging the UI components.
7. **Document deployment steps** (Vercel env vars, CI/CD for migrations).

---

*Prepared by Antigravity (GPT‑OSS 120B), ready for Claude Code to continue building the Eunice Admissions Platform.*
