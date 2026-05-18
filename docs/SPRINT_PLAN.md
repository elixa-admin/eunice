# Eunice MVP Sprint Plan — 6 Weeks to Launch
**Timeline:** May 18 - July 1, 2026  
**Goal:** Ship lightweight MVP + test with 5 learner scenarios from assessment

---

## Overview & Milestones

```
May 18-20:    [SPRINT 1] Assessment Form Build & Deploy (6-8 hours)
May 20-25:    [SPRINT 2] Async prep while Eunice completes assessment
May 25-June 1: [SPRINT 3] Analyze responses + finalize scope + design (20 hours)
June 1-July 1: [SPRINT 4] MVP Build Phase (160 hours, 4 weeks)
```

**Critical Path Dependencies:**
- Assessment deployed → Eunice responds (7 days) → Analysis informs scope → Build starts

**Risk Factors:**
- 4-week MVP timeline is aggressive; scope discipline is critical
- Eunice feedback latency; expect responses by May 25, plan for June 1 worst-case
- Complex integrations (Supabase RLS, email automation, file uploads) need testing

---

## SPRINT 1: Assessment Form Build & Deploy (Today - May 20)
**Goal:** Build, test, deploy discovery assessment form; share public URL with Eunice contact.  
**Total Duration:** 6-8 hours  
**Output:** Public Vercel URL ready for distribution

### 1.1 — Project Setup (1 hour)
**Goal:** Create separate Next.js assessment app, wire up dependencies.

- [ ] Create `/assessment/` directory in Eunice project
- [ ] Run `npx create-next-app@latest` with TypeScript, TailwindCSS, shadcn/ui defaults
- [ ] Install dependencies: `supabase` client, `zod` for validation
- [ ] Create `.env.local` template (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Initialize Git for assessment app

**Deliverable:** Assessment app skeleton, dependencies installed, ready to code.  
**Blockers:** None (independent of main project).

### 1.2 — Database Schema (30 mins)
**Goal:** Create Supabase table to capture assessment responses.

- [ ] Log into existing Eunice Supabase project (or create new one)
- [ ] Create table: `discovery_assessments` with columns:
  - `id` (UUID, PK)
  - `school_name`, `contact_person`, `contact_role` (text)
  - `intake_grades`, `apps_per_year`, `accepted_per_year` (text)
  - `intake_period`, `process_description` (text)
  - All boolean fields from JSON (access_*, info_*, issue_*, store_*, improve_*, tool_*, future_*)
  - All text fields from JSON (*_other_text, *_explain, etc.)
  - `submitted_at` (timestamp, auto-set)
  - `metadata` (JSONB, for any extra context)
- [ ] Enable RLS (public insert-only, admin read-all)
- [ ] Test insert via SQL editor

**Deliverable:** Ready-to-receive Supabase table, RLS policies set.  
**Blockers:** None.

### 1.3 — Form Component (2 hours)
**Goal:** Build form component from assessment JSON schema; use shadcn/ui for accessibility.

- [ ] Create `/app/components/DiscoveryForm.tsx` with sections:
  - School Info (name, contact, intake details)
  - Access Methods (checkboxes: website, forms, PDF, email, WhatsApp, social, physical)
  - Information Collected (checkboxes: parent, learner, prev school, academic, medical, boarding, sibling)
  - Document Issues (checkboxes: missing, incorrect, blurry, duplicate, incomplete, contact, late, confusion)
  - Storage Methods (checkboxes: Drive, network, local, email, printed)
  - Pain Points (checkboxes: admin, docs, reminders, comms, visibility, speed, tracking, records, compliance)
  - Current Tools (checkboxes: Google Forms, Excel, Sheets, Outlook, WhatsApp, SMS)
  - Future Features (checkboxes: reminders, tracking, dashboard, AI, WhatsApp, analytics, multi-user, multi-campus)
  - Text fields: naming explanation, parent questions, parent confusion, statuses, roles, time sinks, infra limits, final comments
  - Signoff (name, date)

- [ ] Use shadcn/ui components: Form, Checkbox, Input, Textarea, Button
- [ ] Add progress indicator (show section X of Y)
- [ ] Form validation with `zod`
- [ ] Mobile-first layout (responsive, readable on small screens)
- [ ] Clear instructions / help text for each section

**Deliverable:** Fully functional form component, validation works, responsive.  
**Blockers:** None (independent).

### 1.4 — Form Submission (1 hour)
**Goal:** Wire form to Supabase; handle submit, loading, errors gracefully.

- [ ] Create `/app/api/submit-assessment` endpoint
  - Accepts POST with form data
  - Validates against schema
  - Inserts into Supabase `discovery_assessments` table
  - Returns `{ success: true, id: '...' }` or error message
  
- [ ] Add success page (confirmation message, assessment ID)
- [ ] Add error handling (network, validation, DB errors)
- [ ] Test locally with Supabase emulator or staging DB

**Deliverable:** Form submits to Supabase, confirmation on success, errors are user-friendly.  
**Blockers:** Supabase credentials must be set in `.env.local`.

### 1.5 — Test Locally (1 hour)
**Goal:** Full end-to-end test; form submit, data in Supabase, mobile responsive.

- [ ] Run locally: `npm run dev`
- [ ] Fill out entire form
- [ ] Submit and verify success page appears
- [ ] Verify data in Supabase (check table for new row)
- [ ] Test on mobile viewport (F12, toggle device toolbar)
- [ ] Test error states (leave required fields blank, check validation)
- [ ] Test network error gracefully (disable network, try submit)

**Deliverable:** No bugs found in critical path; form is production-ready.  
**Blockers:** If Supabase insert fails, debug credentials and RLS.

### 1.6 — Deploy to Vercel (30 mins)
**Goal:** Push to GitHub, deploy via Vercel, generate public URL.

- [ ] Create GitHub repo (or push assessment/ to existing Eunice repo)
- [ ] Push to `main` branch
- [ ] Connect repo to Vercel project (or create new project)
- [ ] Set environment variables in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Trigger deploy
- [ ] Verify deploy successful (check Vercel dashboard)
- [ ] Note public URL: `https://eunice-assessment.vercel.app/` (or similar)

**Deliverable:** Public URL ready for sharing.  
**Blockers:** GitHub auth, Vercel account setup.

### 1.7 — Prepare Sharing Docs (30 mins)
**Goal:** Create email template and instructions for Eunice contact.

- [ ] Create `/assessment/SHARE.md`:
  - Assessment URL
  - Instructions (what to do, estimated time to complete: 15-20 mins)
  - Contact for questions: your email
  - Deadline: no hard deadline, but sooner is better (aiming for May 25)
  - What happens next: we'll analyze and share findings

- [ ] Draft email to `dienarn@gmail.com`:
  - Subject: "Eunice Intake Workflow Discovery Assessment — Please Complete"
  - Body: Brief context, URL, instructions, timeline
  - Encourage to fill out honestly (no "right answers")

**Deliverable:** Email ready to send, instructions clear.  
**Blockers:** None.

---

## SPRINT 2: Async Prep (May 20-25)
**Goal:** Begin analysis prep, set up design tools, prepare to move fast once assessment closes.  
**Total Duration:** 4-6 hours spread over 5 days (not continuous)  
**Note:** Eunice is completing assessment; we prepare in parallel.

### 2.1 — Assessment Response Monitoring (15 mins/day, 5 days)
**Goal:** Watch for responses; export weekly summary.

- [ ] Check Supabase `discovery_assessments` table daily
- [ ] Note response count, completion status
- [ ] By May 25, export all responses to JSON/CSV: `assessment-responses-may25.json`

**Deliverable:** Response data ready for analysis.  
**Blockers:** No responses = extend deadline to June 1, analyze with partial data.

### 2.2 — Analysis Prep (1.5 hours)
**Goal:** Create analysis framework; prepare spreadsheet to track findings.

- [ ] Create `/assessment-analysis/responses.json` (exported from Supabase)
- [ ] Create `/assessment-analysis/ANALYSIS.md` template with sections:
  - Overview (response count, completion rate, date range)
  - Key Findings (pain points, workflows, bottlenecks)
  - Access Methods Summary (what % use Google Forms, email, etc.)
  - Current Tool Stack (Google Forms, Excel, Outlook breakdown)
  - Identified Workflow States (e.g., "applied → missing docs → reviewed → accepted")
  - Document Requirements (birth cert, school report, etc.)
  - Improvement Priorities (ranked by school)
  - 5 Learner Scenarios (define based on responses)
  - MVP Scope Recommendations (what to build, what to defer)

**Deliverable:** Analysis template ready to fill.  
**Blockers:** None.

### 2.3 — Design Tool Setup (1.5 hours)
**Goal:** Prepare Figma (or equivalent) for rapid Phase 1 design iteration.

- [ ] Open Figma workspace (or use tool of choice)
- [ ] Create project: "Eunice Admissions Platform"
- [ ] Set up design system file with:
  - Color palette (modern, clean)
  - Typography (2-3 font sizes)
  - Component library: buttons, inputs, cards, modals
  - Grid system (mobile-first responsive)
- [ ] Create page templates for:
  - Parent Portal: Home, Login, Application form (multi-step), Status tracking
  - Admin Dashboard: Application list, Application detail, Status change modal
- [ ] Share link with design team (or keep personal)

**Deliverable:** Design workspace ready for rapid iteration.  
**Blockers:** None (Figma account required).

### 2.4 — Tech Setup Decisions (1 hour)
**Goal:** Lock down infrastructure choices; prepare Supabase for main app.

- [ ] Confirm Supabase setup (project exists, credentials noted)
- [ ] Plan main app Supabase schema (applications, documents, communications, users tables)
- [ ] Confirm Vercel setup (connected to GitHub)
- [ ] Confirm Resend email account (API key ready)
- [ ] Document all secrets in secure location (not in code)
- [ ] Create `.env.example` template for main app

**Deliverable:** All infrastructure ready to go; no setup blockers on June 1.  
**Blockers:** If accounts missing, set up now (Supabase, Vercel, Resend, GitHub).

---

## SPRINT 3: Analyze & Design (May 25 - June 1)
**Goal:** Understand Eunice workflow; define 5 learner scenarios; create high-fidelity designs; lock MVP scope.  
**Total Duration:** 20-24 hours (compressed week)  
**Output:** Approved designs, finalized scope, clear development spec.

### 3.1 — Assessment Analysis (2 hours)
**Goal:** Deep-read assessment responses; extract key insights.

- [ ] Export all responses from Supabase
- [ ] Read each response carefully (note common themes)
- [ ] Fill out `/assessment-analysis/ANALYSIS.md`:
  - Pain points (ranked)
  - Current workflow (described in words + diagram)
  - Access methods (% distribution)
  - Document types required
  - Current tool stack (Google Forms % usage, Excel %, Outlook %)
  - Bottlenecks (what takes longest?)
  - Desired improvements (prioritized)

- [ ] Create workflow diagram (Miro, Figma, or simple text flowchart):
  - Current state: how does application flow from parent → admin → decision?
  - States: pending → missing docs → complete → reviewed → accepted/rejected?
  - Who does what (parent, admin officer, principal)?

**Deliverable:** Written analysis + workflow diagram (visible to team).  
**Blockers:** If responses are incomplete/conflicting, note assumptions.

### 3.2 — Define 5 Learner Scenarios (1.5 hours)
**Goal:** Identify common edge cases from assessment; create test personas.

Based on assessment insights, define 5 learner personas:

Example (adjust based on actual responses):
1. **Standard Case:** Parent + learner with complete info, all docs present, no issues
2. **Missing Documents:** Application submitted but parent forgets document; remind → resubmit
3. **Late Application:** Application arrives after initial deadline; flag, but process same way
4. **Boarding Status:** Application includes boarding requirement; affects workflow (additional questions)
5. **Sibling Enrolled:** Learner has sibling already at school; trigger priority pathway or different questions

- [ ] For each scenario, document:
  - Parent context (who, background)
  - Learner context (grade, prior school, special needs)
  - Expected documents
  - Workflow twist (what's different?)
  - Success criteria (what does "done" look like?)

**Deliverable:** 5 clear personas + test cases for Phase 3 validation.  
**Blockers:** If assessment doesn't suggest clear patterns, use your judgment (note assumption).

### 3.3 — Finalize MVP Scope (1 hour)
**Goal:** Lock down what's in Phase 2 build vs. what defers to Phase 4.

**Must-Have (Phase 2):**
- Parent portal: form → upload → submit → status tracking
- Admin dashboard: list → detail → status change → email trigger
- Email: acknowledgement, missing doc reminder, status update, decision
- Document storage + retrieval
- Basic filtering/search (admin)
- Data export (CSV)

**Nice-to-Have (Phase 4):**
- Bulk operations (batch update status)
- Advanced filtering/reporting
- Workflow customization
- WhatsApp integration
- Analytics dashboard
- Multi-school support

**Create:** `/docs/MVP_SCOPE_FINAL.md` (locked scope document)

**Deliverable:** Agreed scope; no scope creep allowed during Phase 2.  
**Blockers:** If business wants more, document as Phase 4 and move on.

### 3.4 — Parent Portal Design (3 hours)
**Goal:** Create mobile-first wireframes + high-fidelity mockups for parent experience.

**Screens:**
1. Welcome/Login
2. Application Start (intro, checklist of required info)
3. Step 1: Parent Info (name, email, phone, address)
4. Step 2: Learner Info (name, DOB, previous school, grades)
5. Step 3: Academic Details (interests, special needs)
6. Step 4: Document Upload (drag & drop, progress, validation feedback)
7. Step 5: Review & Submit (summary, confirmation)
8. Confirmation (reference number, next steps)
9. Status Tracking (current status, document verification, timeline)
10. Communication History (messages from school)

**For each screen:**
- [ ] Wireframe (low-fidelity, layout + content)
- [ ] High-fidelity mockup (colors, typography, spacing)
- [ ] Mobile viewport (375px width)
- [ ] Tablet viewport (768px width)
- [ ] Error states (validation, network error, upload failure)
- [ ] Loading states (form submitting, uploading file)

**Design Principles:**
- Mobile-first, responsive
- Progress indicator (step X of Y)
- Clear instructions / help text
- Minimal form fatigue
- Large touch targets (for older devices)
- High contrast (readability)

**Deliverable:** 10+ approved screens in Figma, mobile-tested, ready for handoff.  
**Blockers:** Design feedback loop (get approval from stakeholder if available).

### 3.5 — Admin Dashboard Design (2.5 hours)
**Goal:** Create desktop-first mockups for admin workflow.

**Screens:**
1. Login
2. Application List (table: ref #, parent name, learner name, status, submitted date)
   - Filters (status, date range, search by name/email)
   - Sorting (ref #, date, status)
   - Pagination (50 per page)
3. Application Detail (full info + documents + notes + status history)
4. Status Change Modal (current status → new status + confirm)
5. Email Trigger Modal (choose template, preview, send)
6. Internal Notes Section (add/edit notes)
7. Document Viewer (upload files, preview, mark verified)
8. Export Modal (filter options, download CSV)

**For each screen:**
- [ ] Wireframe
- [ ] High-fidelity mockup
- [ ] Responsive (desktop 1280px, tablet fallback)
- [ ] Error/loading states
- [ ] Interaction patterns (dropdown, modal, tooltip)

**Design Principles:**
- Dashboard-centric (see all applications at a glance)
- Fast filtering/search
- Minimal clicks to common actions (change status)
- Clear status indicators (color-coded badges)
- Responsive design (works on smaller screens, but optimized for desktop)

**Deliverable:** 8+ approved screens, desktop-optimized, ready for development.  
**Blockers:** None.

### 3.6 — Email Template Designs (1 hour)
**Goal:** Create email templates for 4 communication types.

**Templates:**
1. **Submission Acknowledgement**
   - Content: Thank you, application reference number, next steps, status tracking link
   - Design: Professional, branded, mobile-responsive

2. **Missing Document Reminder**
   - Content: Which docs are missing, deadline, reupload link, urgency
   - Design: Clear call-to-action

3. **Status Update Notification**
   - Content: Application under review, no action needed, timeline
   - Design: Informational, reassuring

4. **Final Decision**
   - Content: Accepted/rejected, next steps, appeal info
   - Design: Clear, professional

**For each template:**
- [ ] HTML mockup (Figma or code)
- [ ] Text-only fallback
- [ ] Mobile-responsive preview
- [ ] Unsubscribe link

**Deliverable:** 4 email templates, ready to code in Resend.  
**Blockers:** None.

### 3.7 — Design Approval & Handoff (1 hour)
**Goal:** Get stakeholder/team approval on designs; prepare for development.

- [ ] Share Figma link with stakeholders (if available)
- [ ] Collect feedback (note blockers vs. nice-to-haves)
- [ ] Make 1-2 rounds of quick revisions
- [ ] Create design spec document:
  - Color palette (hex codes)
  - Typography (font names, sizes)
  - Component library (button styles, input states, etc.)
  - Spacing system (padding/margin units)
  - Responsive breakpoints (mobile, tablet, desktop)
  - Links to all screens in Figma

**Deliverable:** Approved designs + design spec ready for dev team.  
**Blockers:** If major changes requested, note as Phase 4 improvements.

### 3.8 — Create Development Spec (1.5 hours)
**Goal:** Document all requirements for Phase 2 development; create clear handoff.

Create `/docs/DEV_SPEC.md`:
- Architecture overview (tech stack recap)
- Data model (applications, documents, communications, users)
- API endpoints (all parent + admin operations)
- Authentication flow (email signup/login)
- File upload flow (validation, storage, retrieval)
- Email trigger flow (on status change, manual trigger)
- Responsive design requirements (breakpoints, mobile-first)
- Performance targets (load times, uptime)
- Testing requirements (unit, integration, manual)
- Deployment checklist (environment variables, database migrations)

**Deliverable:** Clear, actionable dev spec; no ambiguity.  
**Blockers:** None.

---

## SPRINT 4: MVP Build (June 1 - July 1)
**Goal:** Ship feature-complete, tested, production-ready MVP.  
**Total Duration:** ~160 hours (4 weeks, ~40 hours/week)  
**Output:** Live application at `eunice.vercel.app` (or similar)

This phase is the heaviest lift. Break it into 4 weekly milestones:

### **Week 1 (June 1-7): Infrastructure & Foundation (40 hours)**

#### 4.1.1 — Project Setup & Database Schema (8 hours)

- **Goal:** Create main Next.js app, set up Supabase schema, deploy scaffolding.

- [ ] Create `/` (main app directory, separate from assessment/)
- [ ] Initialize Next.js with TypeScript, TailwindCSS, shadcn/ui
- [ ] Create Supabase migrations file:
  ```sql
  CREATE TABLE schools (...)
  CREATE TABLE users (...)
  CREATE TABLE applications (...)
  CREATE TABLE documents (...)
  CREATE TABLE communications (...)
  CREATE TABLE status_history (...)
  ```
- [ ] Enable RLS on all tables (parent sees own, admin sees school's)
- [ ] Create views for common queries (applications by status, documents by type)
- [ ] Initialize database in dev + staging
- [ ] Test schema with sample data

**Deliverable:** Schema deployed, RLS policies working, sample data present.  
**Blockers:** Supabase quota or RLS complexity.

#### 4.1.2 — Authentication System (6 hours)

- **Goal:** Parent & admin signup/login, session management, role-based access.

- [ ] Set up Supabase Auth (email/password)
- [ ] Create auth context provider (React context + Supabase client)
- [ ] Build parent signup page (email, password, name, phone)
- [ ] Build parent login page (email, password)
- [ ] Build admin login page (special setup for initial admins)
- [ ] Middleware to protect routes (redirects to login if not authenticated)
- [ ] Session persistence (JWT in localStorage, auto-refresh)
- [ ] Password reset flow (email link)
- [ ] Email verification (optional for MVP, note as Phase 4)

**Deliverable:** Auth system works; parents can signup/login, admins can login.  
**Blockers:** Email configuration (may need to whitelist Supabase domain).

#### 4.1.3 — API Foundation (8 hours)

- **Goal:** Create all API endpoints (parent + admin); wire to database.

**Parent Endpoints:**
- `POST /api/applications` (create)
- `GET /api/applications/{id}` (get status)
- `PUT /api/applications/{id}` (draft update)
- `POST /api/applications/{id}/submit` (final submit)
- `POST /api/documents` (upload)
- `GET /api/communications/{application_id}` (message history)

**Admin Endpoints:**
- `GET /api/admin/applications` (list with filters)
- `GET /api/admin/applications/{id}` (detail)
- `PATCH /api/admin/applications/{id}/status` (change status)
- `POST /api/admin/communications/{application_id}/remind` (send email)
- `POST /api/admin/notes/{application_id}` (add note)
- `GET /api/admin/reports/export` (CSV export)

**For each endpoint:**
- [ ] Request validation (zod schema)
- [ ] Database query (Supabase client)
- [ ] Error handling (400, 404, 500)
- [ ] Response formatting (success + error)
- [ ] Test with curl or Postman

**Deliverable:** All endpoints functional, tested with mock data.  
**Blockers:** None.

#### 4.1.4 — Supabase Storage Setup (6 hours)

- **Goal:** Configure document uploads, validation, retrieval.

- [ ] Create Supabase Storage buckets (one per school, for multi-tenancy prep)
- [ ] Set up RLS policies (parents upload to own folder, admins can access school's)
- [ ] Create upload handler (file validation, size check, type check)
- [ ] Create download handler (signed URLs, access control)
- [ ] Implement chunked upload (for large files or slow connections)
- [ ] Test with multiple file types (PDF, JPG, PNG)
- [ ] Test with poor connectivity (simulate network interruption)

**Deliverable:** File uploads work reliably; files stored securely; retrieval works.  
**Blockers:** Storage quota or RLS policy complexity.

#### 4.1.5 — Email Integration (Resend) (8 hours)

- **Goal:** Set up email service, create templates, test delivery.

- [ ] Set up Resend account, get API key
- [ ] Create email template component (React component that renders HTML)
- [ ] Implement 4 email types:
  1. Submission acknowledgement
  2. Missing document reminder
  3. Status update notification
  4. Final decision (accepted/rejected)
- [ ] Create email sending function (call Resend API)
- [ ] Implement email logging (store in communications table)
- [ ] Test email delivery (send test emails, check spam folder)
- [ ] Handle bounces/errors gracefully

**Deliverable:** Emails send reliably; templates are professional; logging works.  
**Blockers:** Resend domain verification, email deliverability.

#### 4.1.6 — Development Setup & CI/CD (4 hours)

- **Goal:** Git workflow, local development, automated testing, deployment pipeline.

- [ ] Create GitHub repo (or use existing Eunice repo)
- [ ] Set up Vercel project (main app, separate from assessment/)
- [ ] Configure environment variables (Supabase, Resend, etc.)
- [ ] Set up GitHub Actions for linting, type checking, testing
- [ ] Configure preview deployments (on PR)
- [ ] Test full deployment pipeline (local → GitHub → Vercel)
- [ ] Document environment setup (`.env.example`, README)

**Deliverable:** Developers can work locally; PRs auto-deploy to preview; main deploys to production.  
**Blockers:** GitHub Actions quota or Vercel configuration.

---

### **Week 2 (June 8-14): Parent Portal (40 hours)**

#### 4.2.1 — Application Form Layout & Navigation (8 hours)

- **Goal:** Multi-step form with progress indicator, save-and-return.

- [ ] Create form container component (orchestrates steps)
- [ ] Create progress indicator (visual: step 1 of 5)
- [ ] Implement form state management (React hooks or context)
- [ ] Create navigation (next/back buttons, step indicators)
- [ ] Implement save-to-draft (auto-save to database)
- [ ] Test back/forward navigation (data persists)
- [ ] Test mobile layout (steps stack, swipe navigation optional)

**Deliverable:** Form structure works; navigation is smooth; draft-save works.  
**Blockers:** None.

#### 4.2.2 — Form Fields & Validation (6 hours)

- **Goal:** Build all form inputs; validate before submission.

**Form Fields:**
- Step 1: Parent info (name, email, phone, address)
- Step 2: Learner info (name, DOB, previous school)
- Step 3: Academic info (grades, interests, special needs)
- Step 4: Document upload
- Step 5: Review

**For each field:**
- [ ] Input component (text, email, date, select, textarea)
- [ ] Validation rule (required, email format, phone format, etc.)
- [ ] Error message (clear, actionable)
- [ ] Accessibility (labels, ARIA, keyboard nav)

**Deliverable:** All fields validate correctly; error messages are helpful.  
**Blockers:** None.

#### 4.2.3 — Document Upload Component (8 hours)

- **Goal:** Drag & drop + file picker, validation, progress, error handling.

- [ ] Create drag-and-drop zone (visual feedback on hover)
- [ ] Create file picker fallback (click to browse)
- [ ] Implement file validation (type: PDF/JPG/PNG, size: <5MB)
- [ ] Show validation errors immediately (format or size)
- [ ] Display upload progress (% complete, file size)
- [ ] Show uploaded files with delete option (before submit)
- [ ] Test on mobile (touch-friendly, file picker works)
- [ ] Test with poor connectivity (retry on failure, graceful timeout)

**Deliverable:** Upload works reliably; progress is visible; errors are clear.  
**Blockers:** None.

#### 4.2.4 — Review & Submit (6 hours)

- **Goal:** Final review page, confirmation, success page.

- [ ] Create review page (display all entered info + uploaded docs)
- [ ] Implement submit button (disabled until form complete)
- [ ] On submit:
  - [ ] Call API to create application
  - [ ] Generate unique reference number
  - [ ] Save to database
  - [ ] Trigger acknowledgement email
  - [ ] Redirect to success page
- [ ] Success page shows:
  - [ ] Application reference number (prominent)
  - [ ] Thank you message
  - [ ] Next steps
  - [ ] Link to status tracking

**Deliverable:** Submit flow works end-to-end; emails are sent; success page is clear.  
**Blockers:** Email delivery (Resend).

#### 4.2.5 — Status Tracking Page (8 hours)

- **Goal:** Parent views application progress, documents, messages.

- [ ] Create status page (GET /api/applications/{id})
- [ ] Display current status (badge with color: pending, under review, accepted, etc.)
- [ ] Show document status (uploaded, verified, rejected)
- [ ] Show timeline (when submitted, when under review, when decision made)
- [ ] Show missing documents (if status = incomplete)
- [ ] Show communication history (link to messages)
- [ ] Refresh button (manual check for updates)
- [ ] Auto-refresh (poll every 30 seconds for updates)
- [ ] Mobile-friendly layout (clear, readable on small screens)

**Deliverable:** Parent can track progress; updates are visible; responsive.  
**Blockers:** None.

#### 4.2.6 — Communication History Page (4 hours)

- **Goal:** Parent views all messages from school.

- [ ] Create messages page (GET /api/communications/{application_id})
- [ ] Display message list (type, date, sender, content)
- [ ] Types: acknowledgement, missing docs reminder, status update, decision
- [ ] Show action items (e.g., "re-upload missing docs")
- [ ] Link to re-upload if docs flagged as missing
- [ ] Responsive design

**Deliverable:** Messages are easy to read; action items are clear.  
**Blockers:** None.

---

### **Week 3 (June 15-21): Admin Dashboard & Email Automation (40 hours)**

#### 4.3.1 — Admin Login & Onboarding (4 hours)

- **Goal:** Admin login, role setup, initial configuration.

- [ ] Create admin login page (email, password)
- [ ] Set up initial admin user (manual creation via Supabase)
- [ ] Create admin onboarding page (setup school info, email templates)
- [ ] Test role-based access (only admin sees dashboard)

**Deliverable:** Admin can log in, dashboard loads.  
**Blockers:** None.

#### 4.3.2 — Application List & Filtering (8 hours)

- **Goal:** Admin views all applications with search, filter, sort.

- [ ] Create application list page (table of all applications)
- [ ] Columns: Reference #, Parent name, Learner name, Status, Submitted date, Last updated
- [ ] Implement filters:
  - [ ] By status (pending, incomplete, submitted, under_review, accepted, rejected)
  - [ ] By date range (date picker)
  - [ ] By search (parent name, learner name, email, phone)
- [ ] Implement sorting (by ref #, date, status)
- [ ] Implement pagination (50 per page)
- [ ] Quick actions: click to view detail
- [ ] Responsive (desktop-optimized, mobile fallback)

**Deliverable:** List is functional; filters work; sorting works; pagination works.  
**Blockers:** None.

#### 4.3.3 — Application Detail & Status Management (8 hours)

- **Goal:** Admin views full application, changes status, triggers emails.

- [ ] Create detail page (GET /api/admin/applications/{id})
- [ ] Display:
  - [ ] Parent info (name, email, phone, address)
  - [ ] Learner info (name, DOB, previous school)
  - [ ] Documents (list, preview, verify/reject)
  - [ ] Status history (timeline)
  - [ ] Internal notes
- [ ] Implement status change:
  - [ ] Dropdown to select new status
  - [ ] Confirmation modal ("Change to [X]? Email will be sent.")
  - [ ] On confirm: update status, trigger email, log change
- [ ] Show email preview (what will be sent)
- [ ] Test email delivery

**Deliverable:** Detail page is functional; status changes work; emails trigger correctly.  
**Blockers:** None.

#### 4.3.4 — Document Review Interface (6 hours)

- **Goal:** Admin reviews, verifies, rejects documents.

- [ ] Create document viewer (PDF preview, image preview)
- [ ] Implement verify/reject buttons
- [ ] Add verification notes (optional)
- [ ] Show document metadata (name, upload date, size)
- [ ] On verify: update documents table
- [ ] On reject: add to missing docs list, send reminder email
- [ ] Mobile-friendly (documents readable on tablet)

**Deliverable:** Documents are viewable; verify/reject works; emails trigger.  
**Blockers:** PDF viewer library (use react-pdf or similar).

#### 4.3.5 — Internal Notes & Collaboration (4 hours)

- **Goal:** Admin adds timestamped notes on application.

- [ ] Create notes section (GET/POST /api/admin/notes)
- [ ] Display note history (date, author, content)
- [ ] Implement add note (text input, character limit)
- [ ] Implement edit/delete (own notes only)
- [ ] Notes are admin-only (not visible to parent)

**Deliverable:** Notes are functional; edit/delete works; history is logged.  
**Blockers:** None.

#### 4.3.6 — Email Triggering & Templates (6 hours)

- **Goal:** Admin sends manual reminder emails, previews templates.

- [ ] Create email trigger modal (manual send reminder)
- [ ] Show email template preview (before sending)
- [ ] Implement send (POST to /api/admin/communications)
- [ ] Log email (store in communications table)
- [ ] Show delivery status (sent, failed, bounced)
- [ ] Handle errors gracefully (show error message, allow retry)

**Deliverable:** Admin can send emails; preview works; logging works.  
**Blockers:** Email service reliability.

#### 4.3.7 — Email Automation Triggers (4 hours)

- **Goal:** Automatic email sends on status changes.

- [ ] On application submit → send acknowledgement email
- [ ] On status change to "incomplete" → send missing docs reminder
- [ ] On status change to "under_review" → send status update email
- [ ] On status change to "accepted"/"rejected" → send decision email
- [ ] Test all triggers (create application, change status, verify emails)

**Deliverable:** Emails send automatically on status changes; no manual intervention needed.  
**Blockers:** Email service reliability, timing issues.

---

### **Week 4 (June 22-28): Testing, Refinement & Deployment (40 hours)**

#### 4.4.1 — Manual End-to-End Testing (10 hours)

- **Goal:** Test all user flows; identify bugs; verify 5 learner scenarios work.

**Parent Flow:**
- [ ] Signup → form fill → document upload → submit → status tracking
- [ ] Resume draft (close browser, reopen, check data persists)
- [ ] Error states (missing fields, invalid file, network error)
- [ ] Mobile experience (test on actual old Android device)

**Admin Flow:**
- [ ] Login → view all applications → filter/search → view detail
- [ ] Change status → verify email sent
- [ ] Add notes → edit notes
- [ ] Verify documents → reject documents
- [ ] Export data (CSV)

**5 Learner Scenarios:**
- [ ] Scenario 1: Complete and submit → verify all steps work
- [ ] Scenario 2: Edit draft, then submit
- [ ] Scenario 3: Upload wrong file, delete, reupload
- [ ] Scenario 4: Missing documents, get reminded, resubmit
- [ ] Scenario 5: Application rejected, review rejection reason

**For each test:**
- [ ] Document any bugs found
- [ ] Note performance issues
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify error messages are clear

**Deliverable:** Bug list compiled; critical bugs prioritized.  
**Blockers:** None (or critical bugs block deployment).

#### 4.4.2 — Performance & Load Testing (6 hours)

- **Goal:** Verify performance targets; optimize if needed.

- [ ] Test page load times (use Lighthouse, WebPageTest)
  - [ ] Parent portal home: <3 seconds on 3G
  - [ ] Admin dashboard: <2 seconds on good connectivity
- [ ] Test on poor connectivity (throttle to 3G/4G)
- [ ] Test on old Android device (actual device or emulator)
- [ ] Check database query performance (any slow queries?)
- [ ] Check file upload performance (large file on 3G)
- [ ] Load test (simulate 10 concurrent users, 100 applications)
- [ ] Profile and optimize if needed (lazy loading, code splitting, etc.)

**Deliverable:** Performance metrics documented; optimization complete.  
**Blockers:** None (or performance issues block deployment).

#### 4.4.3 — Security Audit (6 hours)

- **Goal:** Verify auth, data access, file handling are secure.

- [ ] Verify authentication (can't access app without login)
- [ ] Verify RLS (parents can't see other applications, admins can only see school's)
- [ ] Test file upload security (try uploading malicious file, verify rejected)
- [ ] Test input validation (SQL injection, XSS attempts)
- [ ] Verify sensitive data not in logs (check Vercel & Supabase logs)
- [ ] Check HTTPS enforced (all requests secure)
- [ ] Review environment variables (no secrets in code)
- [ ] Audit email delivery (verify sender, check for spoofing)

**Deliverable:** Security checklist passed; no vulnerabilities found.  
**Blockers:** Critical vulnerabilities must be fixed before deployment.

#### 4.4.4 — UI/UX Polish & Bug Fixes (10 hours)

- **Goal:** Fix bugs, improve UX, polish UI.

**Bug Fixes:**
- [ ] Address all critical bugs from testing
- [ ] Fix responsive design issues
- [ ] Fix validation message clarity
- [ ] Fix error handling (graceful degradation)

**UX Improvements:**
- [ ] Add loading states (spinners, skeleton screens)
- [ ] Improve form instructions (clearer help text)
- [ ] Optimize mobile experience (larger touch targets, swipe nav)
- [ ] Add success/error notifications (toast messages)
- [ ] Improve email templates (professional design, mobile-responsive)

**UI Polish:**
- [ ] Consistent spacing/typography
- [ ] Color consistency (status badges, buttons)
- [ ] Icon consistency
- [ ] Empty states (no data → show helpful message)
- [ ] Skeleton screens (while loading)

**Deliverable:** App feels polished; UX is smooth; bugs are minimal.  
**Blockers:** None.

#### 4.4.5 — Documentation & Handoff (4 hours)

- **Goal:** Document system for maintainability; prepare for pilot.

- [ ] Update README (how to run locally, deploy, troubleshoot)
- [ ] Document API endpoints (request/response examples)
- [ ] Document database schema (table descriptions)
- [ ] Document environment variables (what each does)
- [ ] Create admin user guide (how to use dashboard)
- [ ] Create parent user guide (how to apply)
- [ ] Document deployment checklist (steps to deploy)
- [ ] Document troubleshooting guide (common issues + fixes)

**Deliverable:** Documentation complete; team can operate system.  
**Blockers:** None.

#### 4.4.6 — Final Deployment & Go-Live (4 hours)

- **Goal:** Deploy to production, verify everything works, prepare for pilot.

- [ ] Final smoke test (create test application end-to-end)
- [ ] Verify all environment variables set correctly
- [ ] Run database migrations in production
- [ ] Test in production (sandbox account)
- [ ] Monitor logs for errors (first 24 hours)
- [ ] Verify email delivery in production (send test emails)
- [ ] Create production backups (database, storage)
- [ ] Document deployment completed (date, version, notes)

**Deliverable:** MVP is live at `eunice.vercel.app` (or similar); ready for pilot.  
**Blockers:** Deployment errors (rare if CI/CD is solid).

---

## Post-MVP: Ready for Pilot (June 28 - July 1)

### Final Phase: 5 Learner Scenario Testing & Refinement

#### 4.5.1 — Test 5 Learner Scenarios (6 hours)
- [ ] Run through each of the 5 defined scenarios from assessment
- [ ] Verify each completes successfully
- [ ] Collect timing data (how long each scenario takes)
- [ ] Note any UX friction points
- [ ] Document actual workflows vs. expected

**Deliverable:** 5 scenarios tested, documented, working.

#### 4.5.2 — Final Refinements & Fixes (2 hours)
- [ ] Address any remaining issues from scenario testing
- [ ] Final polish (cosmetic improvements)
- [ ] Prepare for live pilot

**Deliverable:** MVP is production-ready for Eunice pilot.

---

## Summary: Total Sprint Hours

| Sprint | Duration | Hours | Status |
|--------|----------|-------|--------|
| **SPRINT 1** | May 18-20 | 6-8 | **In Progress** |
| **SPRINT 2** | May 20-25 | 4-6 | Pending |
| **SPRINT 3** | May 25-June 1 | 20-24 | Pending |
| **SPRINT 4 W1** | June 1-7 | 40 | Pending |
| **SPRINT 4 W2** | June 8-14 | 40 | Pending |
| **SPRINT 4 W3** | June 15-21 | 40 | Pending |
| **SPRINT 4 W4** | June 22-28 | 40 | Pending |
| **Final** | June 28-July 1 | 8 | Pending |
| **TOTAL** | 6 weeks | ~158-166 | — |

---

## Critical Dependencies & Blockers

**Path to MVP:**
1. Assessment form deployed ✓ (SPRINT 1)
2. Eunice completes assessment (waiting, ~7 days)
3. Analysis + scope locked (SPRINT 3)
4. Design approved (SPRINT 3)
5. MVP built (SPRINT 4, 4 weeks)
6. 5 scenarios tested (final week)
7. Go-live (July 1)

**Risk Factors:**
- **Scope creep** → if new features requested, defer to Phase 4
- **Integration complexity** → Supabase RLS, email, file uploads can be tricky
- **Eunice feedback delay** → if assessment responses come late, compress analysis time
- **Performance** → old Android devices can be slow; test early and often

**How to Stay on Track:**
- Daily standup (15 mins, identify blockers)
- Weekly review (Thursday, assess progress vs. plan)
- Aggressive scope discipline (MVP is tightly scoped)
- Parallel work where possible (design + backend setup in parallel)
- Frequent deployments (deploy to preview often, catch issues early)

---

## Next Actions

1. ✅ **TODAY (May 18):** Start SPRINT 1 — Build assessment form
2. **By May 20:** Assessment form deployed, URL ready to share
3. **May 25:** Analysis complete, 5 scenarios defined, scope locked
4. **June 1:** Phase 2 development starts (SPRINT 4 Week 1)
5. **July 1:** MVP complete, ready for pilot

---

**Last Updated:** 2026-05-18  
**Plan Owner:** Brandon Dienar  
**Status:** SPRINT 1 Underway
