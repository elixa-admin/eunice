# Eunice School Intake Platform — Master Context Prompt

**Last Updated:** 2026-05-19  
**Phase:** 0 (Discovery) — Active Development  
**Ship Date:** July 1, 2026 (6 weeks)

---

## 🎯 Mission

Build a digital school admissions platform for Eunice High School (MVP). Goal: Reduce administrative burden, automate repetitive tasks, improve parent experience. Foundation for future SaaS scaling to other South African schools.

**Not a full ERP.** Admissions-only MVP. Scope discipline is critical.

---

## 📊 Current Status (May 19, 2026)

### Phase 0: Discovery ✅ NEARLY COMPLETE
- **Assessment Form:** Live on Vercel (https://eunice-blue.vercel.app/assessment)
- **Database:** Supabase PostgreSQL table created (`discovery_assessments`, 102 fields)
- **Email Delivery:** Gmail SMTP configured (nodemailer)
- **Pending:** One stakeholder submission from Eunice (form deployed, awaiting completion)

### Phase 1: Design (May 20 - Jun 1) — PLANNED
- Design system creation
- Parent portal wireframes + prototype
- Admin dashboard wireframes + prototype
- Stakeholder review & sign-off

### Phase 2: MVP Build (Jun 1 - Jul 1) — PENDING PHASE 1
- Parent portal development
- Admin dashboard development
- Backend API endpoints
- Testing & deployment

### Phase 3: Pilot (Jul 1+) — Post-MVP
- Production deployment
- User training
- Live admissions cycle
- Feedback collection

---

## 🏗️ Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 16.2.6 + React 19.2.4 + TypeScript | Modern, SSR, fast iteration |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first, component library |
| **Backend** | Supabase (PostgreSQL) | Managed DB, auth, storage, RLS |
| **Hosting** | Vercel | Auto-deploy on push, serverless APIs |
| **Email** | Gmail SMTP + nodemailer | No domain verification needed |
| **Storage** | Supabase Storage (PostgreSQL-backed) | Integrated, secure, simple |
| **Git** | GitHub (elixa-admin/eunice) | Version control, CI/CD trigger |

**Philosophy:** Managed services only. No Docker, Kubernetes, or custom DevOps. Lightweight, fast iteration, low operational burden.

---

## 🗂️ Project Structure

```
eunice/
├── MASTER_PROMPT.md (THIS FILE)
├── CLAUDE.md (Development guidelines)
├── README.md (Overview)
├── docs/
│   ├── PROJECT_BRIEF.md (Strategic context)
│   ├── PHASES.md (Phase breakdown & success criteria)
│   ├── ARCHITECTURE.md (Tech decisions, API spec, data model)
│   ├── REQUIREMENTS.md (Detailed user flows)
│   ├── SPRINT_PLAN_3_4.md (Next 2 sprints in detail)
│   ├── ASSESSMENT_ANALYSIS.md (Pending: insights from form responses)
│   ├── DESIGN_SYSTEM.md (Pending: Figma component specs)
│   └── DESIGN_HANDOFF.md (Pending: prototype links for Phase 2)
├── assessment/ (Phase 0: Discovery form)
│   ├── package.json (Next.js, Supabase, nodemailer, Tailwind)
│   ├── app/
│   │   ├── page.tsx (Multi-section form, 9 sections, 102 fields)
│   │   └── api/
│   │       └── submit-assessment/
│   │           └── route.ts (Form submission → Supabase + Gmail email)
│   ├── tailwind.config.ts (Tailwind config)
│   └── tsconfig.json
├── public/ (Static assets)
└── .env.local (NOT COMMITTED: Supabase + Gmail credentials)
```

---

## 🔑 Key URLs & Credentials

### Live Deployment
- **Assessment Form:** https://eunice-blue.vercel.app/assessment
- **GitHub:** https://github.com/elixa-admin/eunice
- **Vercel Dashboard:** https://vercel.com (elixa-admin workspace)
- **Supabase:** https://supabase.com (project: eunice)

### Environment Variables (Set in Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx (public, safe to commit)
GMAIL_USER=brandondienar@gmail.com
GMAIL_APP_PASSWORD=utac ygnr ztyx jshq (Google App Password)
```

**Note:** `.env.local` is .gitignored. Credentials live in Vercel env vars only.

---

## 📋 Assessment Form (Phase 0 Deliverable)

### Form Structure
- **9 Sections** | **102 Total Data Points**
- **18 Text Fields** (narrative, open-ended)
- **84 Boolean Checkboxes** (multi-select)
- **Responsive** (mobile-first, all devices)
- **Progress Indicator** (shows current section / total)

### Sections & Data Capture

1. **School Information** (8 fields)
   - School name, contact person, email, role, grades, applications/year, acceptances/year, intake period

2. **Parent Access** (7 checkboxes + "Other")
   - How parents reach the system: website, Google Forms, PDF, email, WhatsApp, social media, physical visit

3. **Information Collected** (7 checkboxes + "Other")
   - Parent/guardian, learner, previous school, academic, medical, boarding, sibling info

4. **Document Issues** (8 checkboxes)
   - Missing, incorrect, blurry, duplicates, incomplete, contact difficulty, late, confusion

5. **Storage Method** (5 checkboxes)
   - Google Drive, network drive, local, email, printed

6. **Improvement Priorities** (9 checkboxes)
   - Admin work, docs, reminders, comms, visibility, speed, tracking, records, compliance

7. **Current Tools** (6 checkboxes + "Other")
   - Google Forms, Excel, Sheets, Outlook, WhatsApp, SMS

8. **Future Priorities** (8 checkboxes)
   - Reminders, tracking, dashboard, AI, WhatsApp, analytics, multi-user, multi-campus

9. **Additional Details** (14 text fields + signoff)
   - Process description, document naming, parent questions, confusion points, statuses, roles (4), third parties, time sinks, infra limits, system wishlist, final comments, sign-off name, sign-off date

### Database Table
**Table:** `discovery_assessments`  
**Columns:** All 102 fields + auto-generated `id`, `created_at`, `updated_at`  
**RLS:** Public INSERT + SELECT (allow anon submissions and retrieval)  
**Status:** Created in Supabase via SQL, seeded with schema

---

## 📧 Email Delivery (Phase 0 Implementation)

### Gmail SMTP Setup
- **Service:** Gmail (nodemailer)
- **Auth:** App Password (not main password—security)
- **From:** `brandondienar@gmail.com`
- **Admin Receives:** Full assessment summary (all 102 fields, organized by section)
- **Respondent Receives:** Confirmation email ("Thank you, we'll review and be in touch within 7 days")

### Email Content
- **Admin Email:** Comprehensive table + all checkbox selections + narrative fields
- **Respondent Email:** Simple thank-you + timeline expectations
- **Delivery:** Immediate (synchronous, no queue)

---

## ✅ Phase 0 Deliverables (In Progress)

- [x] Assessment form deployed to Vercel
- [x] Form captures 102 data points
- [x] Supabase table created & RLS policies set
- [x] Email delivery configured (Gmail SMTP)
- [x] Form UI (dark text on light background, readable)
- [x] Git workflow (commits, pushes, CI/CD via Vercel)
- [ ] **Pending:** 1+ stakeholder submission from Eunice
- [ ] **Pending:** Email validation (test with real submission)
- [ ] **Pending:** Mobile UX test (iPhone, Android)

**Gate:** Phase 1 starts only after stakeholder assessment is received & analyzed.

---

## 🎨 Phase 1 Plan (May 20 - Jun 1)

### Sprint 3: Parallel Prep (May 20-25)
While waiting for assessment responses:
1. Design system in Figma (colors, typography, 10+ components)
2. Document handling spike (storage decision: Supabase Storage)
3. Mock data (5 sample applications at different statuses)
4. Figma prototype scaffolding (artboards for all screens)
5. Begin assessment analysis (as responses arrive)

**Deliverable:** Design system, mockup data, architecture decisions, Figma structure ready

### Sprint 4: Design & Analysis (May 25 - Jun 1)
1. Analyze all assessment responses → extract workflow, states, roles, documents
2. Parent portal design (8-10 screens: auth, app creation, upload, tracking, interactive prototype)
3. Admin dashboard design (10-12 screens: list, detail, status, notes, export, interactive prototype)
4. Design system finalization (component specs, tokens, dev handoff)
5. Stakeholder review & sign-off

**Deliverable:** Interactive Figma prototypes, design system docs, stakeholder approval

---

## 🔨 Phase 2 Plan (Jun 1 - Jul 1)

**Based on Phase 1 design** (once approved):

### Backend
- Supabase schema (users, applications, documents, communications)
- API endpoints (parent signup/login, app CRUD, doc upload, status tracking, admin operations)
- Row-level security (RLS) policies
- Email automation (Resend or nodemailer templates)
- Cron jobs (scheduled reminders)

### Parent Portal
- Auth (signup, email verification, login, password reset)
- Application form (multi-step, save-and-return, validation)
- Document upload (drag-and-drop, validation, progress)
- Status tracking (dashboard, timeline, missing docs)
- Communication history (message log)

### Admin Dashboard
- Application list (filters, search, pagination, quick actions)
- Detail view (full application + documents + timeline)
- Status management (change status → trigger email)
- Internal notes (timestamps, author)
- Reports (export CSV, basic metrics)

### Testing & QA
- Unit tests (business logic)
- Integration tests (API endpoints)
- Manual testing (all user flows)
- Mobile testing (iPhone, old Android)
- Performance testing (slow networks)

---

## 📱 Design Philosophy

### Parent Experience
- **Mobile-first** (375px starting point)
- **Simple & guided** (step-by-step, clear progress)
- **Minimal friction** (save drafts, large tappable buttons)
- **Clear feedback** (upload progress, validation errors, confirmations)
- **Accessible** (readable text, color contrast, keyboard nav)

### Admin Experience
- **Dashboard-centric** (all apps visible, filter/search prominent)
- **Efficient** (minimal clicks, bulk actions)
- **Clear status** (color-coded statuses, timeline view)
- **Responsive** (works on desktop, tablet, mobile)
- **Operational clarity** (what's pending, what's missing, trends)

### Design System (Figma)
- Color palette (blues, indigos, grays for professional ed app)
- Typography (headings, body, labels, captions)
- Component library (buttons, inputs, modals, tables, cards, badges, alerts)
- Spacing scale (8px, 16px, 24px, etc.)
- Responsive grid (8-col mobile, 12-col desktop)

---

## 🚀 Deployment Pipeline

**Local → GitHub → Vercel (Automated)**

1. **Local Development**
   - Edit code in Claude Code (or your IDE)
   - Test locally (npm run dev)
   - Commit changes (git commit)

2. **Push to GitHub**
   - git push origin main
   - GitHub receives commit

3. **Vercel Auto-Deploy**
   - Vercel webhook triggers build
   - Installs dependencies (npm install)
   - Runs build (next build)
   - Deploys to preview & production URLs
   - Environments: Production (main), Preview (PRs)

4. **Monitoring**
   - Check Vercel dashboard for build status
   - Logs available in Vercel UI
   - Environment variables managed in Vercel settings

---

## 🔐 Security & Compliance

### Data Protection
- **Encryption at rest:** Supabase default (PostgreSQL native)
- **Encryption in transit:** HTTPS everywhere (Vercel enforces)
- **File storage:** Supabase Storage (encrypted, signed URLs)
- **Audit trail:** Timestamps on all records

### Authentication
- **Parent signup:** Email + password (Supabase Auth)
- **Admin access:** Email + password (to be designed in Phase 2)
- **Session persistence:** JWT tokens, secure cookies
- **Email verification:** Required before activation

### Row-Level Security (RLS)
- Parents see only their applications
- Admins see only their school's applications
- System-wide permissions via role (to be implemented)

### Compliance (POPIA)
- Data retention policies (TBD in Phase 2)
- User deletion requests (TBD in Phase 2)
- Third-party data sharing (none planned for MVP)

---

## 📊 Success Metrics (By Phase)

| Phase | Gate | Metrics |
|-------|------|---------|
| **Phase 0** | Stakeholder assessment returned | 1+ submissions, all 102 fields captured, email delivered |
| **Phase 1** | Designs approved | Stakeholder sign-off, no critical feedback outstanding |
| **Phase 2** | MVP complete | All features coded, tested, deployed, performant |
| **Phase 3** | Pilot succeeds | 99.9% uptime, user satisfaction, admin workload ↓ |

---

## ⚠️ Known Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Stakeholder slow to respond | Medium | Delays Phase 1 | Begin design with generic patterns; iterate when data arrives |
| Design feedback requires rework | Low | Delays Phase 2 | Mid-sprint stakeholder review (don't wait for Friday) |
| Email delivery unreliable | Low | Blocks Phase 0 | Gmail SMTP is proven; monitor Vercel logs |
| Mobile performance on old devices | Medium | Poor UX | Test on actual devices; optimize images/JS |
| Scope creep | High | Misses deadline | Document all requests as Phase 4; Phase 1 = design only |

---

## 🔄 Hand-Off to Other AI Models

**If using Gemini, Sonnet, or other models:**

1. **Copy this entire MASTER_PROMPT.md** as context
2. **Add your specific request** (e.g., "Design the parent auth flow", "Build the admin dashboard API")
3. **Reference the docs** (`PROJECT_BRIEF.md`, `PHASES.md`, `REQUIREMENTS.md`)
4. **Commit & push** all changes back to GitHub/Vercel

All context is self-contained. Other models can pick up and execute independently.

---

## 📞 Key Contacts & Communication

- **Stakeholder:** Eunice High School (Principal, Admissions Lead)
- **Builder:** Brandon Dienar (brandon@elixa.co.za, brandondienar@gmail.com)
- **Repository:** github.com/elixa-admin/eunice
- **Deployed:** eunice-blue.vercel.app

---

## 📅 Timeline Summary

```
May 18-19:  Phase 0 Complete (Form deployed, database ready)
May 19-20:  Assessment form sent to Eunice
May 20-25:  Sprint 3 (Design system, prep, assessment analysis)
May 25-Jun1: Sprint 4 (Design parent portal + admin dashboard)
Jun 1:      Phase 1 Gate (Designs approved → Phase 2 kickoff)
Jun 1-Jul1: Phase 2 (Build MVP)
Jul 1:      MVP Shipped → Phase 3 Pilot begins
```

**Critical Path:** Stakeholder sign-off by May 31 so Phase 2 can start June 1 without delay.

---

**This is the complete context. Share this file with any AI model or team member to onboard them immediately.**
