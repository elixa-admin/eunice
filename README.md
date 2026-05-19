# Eunice School Intake Platform

A modern digital admissions and learner intake workflow platform for Eunice High School, with foundations for broader South African school adoption.

## Project Status
🔄 **Phase 1** — Design Planning (Sprint 3: May 20–25)

**Latest (May 19):**
- ✅ Assessment form complete & live at http://localhost:3000
- ✅ Local dev environment fixed (auto port-finding, Chrome extension support)
- ✅ Sprint 3 design work ready to start
- 📅 Deadline: June 1 (Phase 1 complete) → July 1 (MVP launch)

## Quick Links
- [Project Brief](./docs/PROJECT_BRIEF.md)
- [Architecture & Tech Stack](./docs/ARCHITECTURE.md)
- [Development Phases](./docs/PHASES.md)
- [Workflow & Requirements](./docs/REQUIREMENTS.md)

## Core Vision
**Not** an online form.  
**Is** a workflow orchestration platform for school admissions.

Transform from:
- Manual reviews, document verification, email chasing, spreadsheet tracking
- Fragmented storage, poor visibility, frustrating parent experience

To:
- Automated workflow, centralised tracking, modern parent portal
- Admin dashboard with visibility, reduced repetitive work
- Foundation for scalable SaaS platform across SA schools

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel + GitHub |
| Email | Resend |

## Key Principles
- Minimise infrastructure complexity
- Use managed services (no Kubernetes, Docker, microservices in MVP)
- Mobile-first, lightweight, modern SaaS feel
- Aggressive scope discipline (admissions workflow only, not full ERP)
- Design for older Android devices + poor connectivity

## Success Metric
Reduce administrative burden, improve workflow visibility, and modernise learner admissions at Eunice High School.
