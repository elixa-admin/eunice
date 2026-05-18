# Eunice School Intake Platform — Development Guide

## Quick Start

**What is this?**  
A modern digital admissions and learner intake workflow platform for Eunice High School, built as the foundation for a future SaaS platform across South African schools.

**Current Phase:** Phase 0 — Discovery & Workflow Mapping (not started)

**Key Docs:**
- [Project Brief](./docs/PROJECT_BRIEF.md) — Business context and vision
- [Architecture & Tech Stack](./docs/ARCHITECTURE.md) — Tech decisions, data model, API design
- [Development Phases](./docs/PHASES.md) — Phase breakdown, timelines, deliverables
- [Functional Requirements](./docs/REQUIREMENTS.md) — Detailed feature specs, user flows, success criteria

---

## Tech Stack at a Glance

| Layer | Tech |
|-------|------|
| Frontend | Next.js + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel |
| Email | Resend |
| Git | GitHub |

**Why?** Minimalist infrastructure, managed services, no Docker/Kubernetes during MVP. Mobile-first. Scales to SaaS.

---

## Project Structure

```
eunice/
├── README.md (overview)
├── CLAUDE.md (this file)
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── ARCHITECTURE.md
│   ├── PHASES.md
│   └── REQUIREMENTS.md
├── src/ (created during Phase 2)
│   ├── app/ (Next.js app)
│   ├── components/ (React components)
│   ├── lib/ (utilities, database queries)
│   └── styles/ (Tailwind, globals)
├── public/ (static assets)
└── .env.local (environment variables, not committed)
```

---

## Development Workflow

### Before Starting Any Phase

1. **Read the relevant phase docs** in `docs/PHASES.md`
2. **Review success criteria** to understand what "done" means
3. **Check blockers** — are dependencies from earlier phases complete?

### Phase 0 (Discovery)
- Interview Eunice stakeholders
- Document current workflows (flowcharts, descriptions)
- Identify pain points and constraints
- Define application states and transitions
- Validate scope with stakeholders
- **Deliverable:** Workflow documentation, stakeholder sign-off

### Phase 1 (Design)
- Create wireframes (Figma or similar)
- Design parent portal journey
- Design admin dashboard
- Validate mobile-first approach
- Get stakeholder approval
- **Deliverable:** Design system + approved prototypes

### Phase 2 (Development)
- Set up repository structure, Next.js, Supabase
- Build parent portal (auth, form, uploads, status tracking)
- Build admin dashboard (list, detail, status, emails, export)
- Implement backend (database schema, API endpoints)
- Email integration (Resend templates)
- Deploy to Vercel (automatic on push)
- Testing (unit, integration, manual)
- **Deliverable:** Feature-complete MVP

### Phase 3 (Pilot)
- Deploy to production
- Train Eunice staff
- Monitor during live admissions cycle
- Gather feedback weekly
- Fix bugs in 24 hours
- Measure metrics
- **Deliverable:** Post-pilot report, refined system

### Phase 4 (Future)
- Analytics dashboard
- WhatsApp integration
- Multi-school tenancy
- AI/OCR features
- Mobile app

---

## Key Principles

✅ **DO:**
- Use managed services (Supabase, Vercel, Resend)
- Mobile-first design (older Android devices)
- Aggressive scope discipline (admissions only, not ERP)
- Simple is better than complex
- Test on real devices before shipping

❌ **DON'T:**
- Add features beyond MVP scope
- Use Docker, Kubernetes, or custom DevOps
- Prematurely optimize
- Build "for the future" — validate first
- Overengineer MVP

---

## Data Model (Core Entities)

```
applications
├── reference_number (e.g., "EUNICE-2024-001")
├── parent_id → users
├── learner_id → users
├── status (pending, incomplete, submitted, under_review, accepted, rejected)
├── submitted_at, updated_at, created_at
└── notes (internal, admin-only)

documents
├── application_id
├── document_type (birth_cert, school_report, proof_residence, id_copy)
├── file_path (Supabase Storage)
├── uploaded_at
└── verified_at (admin verification timestamp)

communications
├── application_id
├── type (acknowledgement, reminder, status_update, decision)
├── sent_at, delivery_status
└── template_used

users (Supabase Auth)
├── email, password (auth managed by Supabase)
├── first_name, last_name, phone, address
├── role (parent, admin, principal)
└── school_id (for multi-tenancy future)
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full schema.

---

## API Surface (MVP)

### Parent Endpoints
- `POST /api/auth/signup` — Create parent account
- `POST /api/applications` — Create application
- `GET /api/applications/{id}` — Get application status
- `PUT /api/applications/{id}` — Update (draft)
- `POST /api/applications/{id}/submit` — Final submit
- `POST /api/documents` — Upload document
- `GET /api/communications/{application_id}` — Message history

### Admin Endpoints
- `GET /api/admin/applications` — List all (filterable)
- `GET /api/admin/applications/{id}` — Full detail
- `PATCH /api/admin/applications/{id}/status` — Change status (triggers email)
- `POST /api/admin/communications/{application_id}/remind` — Send reminder
- `POST /api/admin/notes/{application_id}` — Add note
- `GET /api/admin/reports/export` — Export CSV

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full API spec.

---

## Deployment

**Pipeline:**
```
Local dev (Claude Code) → Push to GitHub → Vercel auto-deploys (preview + production)
```

**Environment Variables** (.env.local, not committed):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
RESEND_API_KEY=xxx
```

**Database Migrations:**
- Use Supabase SQL Editor or CLI for migrations
- Keep migration files in `supabase/migrations/`
- Run migrations before deploying

---

## Testing Strategy

### Unit Tests
- API endpoints (business logic)
- Data validation functions
- Email template rendering

### Integration Tests
- Parent signup → form submission → document upload → status update
- Admin login → view applications → change status → email triggered
- Document upload and retrieval

### Manual Tests (before pilot)
- Parent experience on: iPhone, Android (old + new), desktop
- Admin experience on desktop (responsive, filters work)
- Email delivery (check spam folder)
- Old Android device on 3G (slow, intermittent connectivity)

### Load Testing (Phase 3 prep)
- Verify system handles concurrent applicants
- Monitor response times
- Check database performance

---

## Security & Compliance

### Authentication
- Email + password (Supabase Auth)
- JWT sessions
- HTTPS everywhere (Vercel enforces)
- Email verification required

### Authorization (Row-Level Security)
- Parents see only their applications
- Admins see only their school's applications
- Principals see all + logs

### Data Protection
- Files encrypted at rest (Supabase default)
- No sensitive data in logs
- Audit trail for all data access
- POPIA compliance (South African privacy law)

### File Handling
- Type validation (PDF, JPG, PNG only)
- Size limit (5 MB per file)
- Filename sanitization
- Secure storage (Supabase Storage)

---

## Common Tasks

### Start a Phase
1. Read phase docs in [PHASES.md](./docs/PHASES.md)
2. Review success criteria
3. Break into subtasks
4. Update git branch name to reflect phase (e.g., `phase-2-development`)

### Deploy a Change
```bash
git add .
git commit -m "feat: description"
git push origin <branch>
# Vercel auto-deploys preview
# Create PR when ready
# Merge to main
# Vercel deploys production
```

### Add a Database Migration
```bash
# In Supabase SQL Editor, write migration
-- Create new table or alter schema
-- Copy SQL to supabase/migrations/[timestamp]_description.sql
# Migrations run automatically in dev and production
```

### Send Test Email
- Use Resend playground in dashboard
- Template: Submit email, missing doc reminder, status update, decision
- Check HTML rendering, mobile view

### Debug Parent Portal Issue
1. Check browser console (F12 → Console)
2. Check Supabase logs (Supabase dashboard)
3. Check Vercel function logs (Vercel dashboard)
4. Test on actual old Android device if mobile-specific

---

## Key Stakeholders

- **Eunice High School:**
  - Principal (sign-off on scope, workflow)
  - Admissions Officer(s) (daily use, feedback)
  - Parents (end users, feedback)
  
- **Development:**
  - You (builder, architecture decisions)
  - Claude Code (scaffolding, rapid MVP)

---

## Questions Before Starting?

1. **Phase 0:** Have workflow interviews been done? Do we have stakeholder sign-off on scope?
2. **Phase 1:** What design tool? (Figma recommended)
3. **Phase 2:** When should first deployment happen? (estimate 3-4 weeks from start)
4. **Phase 3:** Pilot admissions cycle dates? (needed for scheduling)
5. **Budget:** Cost ceiling? (MVP should stay <$50/month)

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Resend Email Docs](https://resend.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**Last Updated:** 2026-05-18  
**Status:** Project Initialized, Phase 0 Ready to Start
