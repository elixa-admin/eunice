# Architecture & Tech Stack

## Tech Stack Selection

### Frontend Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js | SSR-capable, excellent mobile support, optimal for Vercel |
| Language | TypeScript | Type safety, maintainability, better DX |
| Styling | TailwindCSS | Mobile-first utilities, low-code, lightweight |
| Components | shadcn/ui | Accessible, Radix-based, composable, works with Tailwind |

**Why this combination:**
- Next.js handles SSR for fast initial loads (important for poor connectivity)
- TailwindCSS + shadcn/ui = rapid UI development without heavy component libraries
- TypeScript catches errors early in a rapidly-evolving codebase
- Mobile-first by design

### Backend Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend | Supabase | All-in-one: PostgreSQL + Auth + Storage |
| Database | PostgreSQL | Relational, reliable, proven for structured data |
| Auth | Supabase Auth | Built-in, supports parent/admin roles |
| Storage | Supabase Storage | S3-compatible, simple document management |

**Why Supabase:**
- No separate infrastructure management
- Auth and storage bundled (fewer external integrations)
- Generous free tier
- Real-time subscriptions (future feature: live application updates)
- Scales affordably for MVP → SaaS evolution

### Hosting & Infrastructure
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Hosting | Vercel | Built for Next.js, serverless, excellent CDN |
| Git | GitHub | Source control, integrates with Vercel CI/CD |
| Email | Resend | Reliable, developer-friendly, works with Vercel functions |

**Why this approach:**
- Vercel handles deployment, scaling, CDN automatically
- Zero Docker/Kubernetes complexity
- GitHub provides free CI/CD through Vercel integration
- Resend provides templated, reliable email delivery

### Email Automation
- Service: Resend
- Use cases: Application acknowledgement, missing document reminders, status updates, final decisions
- Background processing: Vercel Cron + serverless functions (or Bull/BullMQ if more complex scheduling needed)

---

## Architecture Principles

### Minimalist Infrastructure
✅ Use managed services (Supabase, Vercel, Resend)  
✅ No custom DevOps, Kubernetes, or Docker complexity  
✅ Aggressive use of open-source components (shadcn/ui, TailwindCSS)  
✅ Avoid microservices during MVP phase  

❌ No custom infrastructure  
❌ No enterprise over-engineering  
❌ No unnecessary abstractions  

### Scalability for SaaS Evolution
- Database design supports future multi-tenancy (school_id partitioning)
- API structure supports future mobile apps (REST/GraphQL ready)
- Auth system supports role-based access (parent, admin, eventually multi-school admins)
- Storage hierarchy supports document categorization and audit

### Cost Efficiency
- MVP expected to operate at extremely low monthly cost
- Free tiers: Vercel (up to $20/month spillover), Supabase (generous free tier), Resend (reasonable email pricing)
- No enterprise contracts required

---

## High-Level Data Model

```
schools
├── name
├── email_settings
├── workflow_config

applications
├── id (unique reference number)
├── school_id
├── parent_id
├── learner_id
├── status (pending, incomplete, submitted, under_review, accepted, rejected)
├── created_at
├── updated_at
├── submitted_at

applicants (parent + learner combined)
├── id
├── name
├── email
├── phone
├── documents

documents
├── id
├── application_id
├── document_type (birth_cert, school_report, proof_residence, etc.)
├── file_url
├── uploaded_at
├── verified_at

communications
├── id
├── application_id
├── type (acknowledgement, reminder, status_update, decision)
├── sent_at
├── template_used

admin_notes
├── id
├── application_id
├── admin_id
├── note_text
├── created_at
```

---

## API Surface (MVP)

### Parent-Facing
- `POST /api/applications` — Create new application
- `GET /api/applications/{id}` — Get application status
- `PUT /api/applications/{id}` — Update application (draft mode)
- `POST /api/applications/{id}/submit` — Final submission
- `POST /api/documents` — Upload document
- `GET /api/communications/{application_id}` — Get communication history

### Admin-Facing
- `GET /api/admin/applications` — List all applications (with filtering)
- `GET /api/admin/applications/{id}` — Full application + documents
- `PATCH /api/admin/applications/{id}/status` — Update status
- `POST /api/admin/communications/{application_id}` — Send reminder email
- `POST /api/admin/notes/{application_id}` — Add internal note
- `GET /api/admin/reports/export` — Export CSV/report

---

## Background Jobs & Automation

### Email Triggers (Resend)
1. **Submission acknowledgement** — Triggered on application submit
2. **Missing document reminder** — Triggered when status set to "incomplete"
3. **Status update notification** — Triggered when status changes
4. **Final decision notification** — Triggered when status set to "accepted" or "rejected"

### Implementation
- Vercel Cron jobs for scheduled reminders (daily missing-doc checks)
- Serverless functions for immediate triggers (acknowledgement on submit)
- Consider Bull/BullMQ if retry logic becomes complex

---

## Deployment Pipeline

```
Local Development (Claude Code)
    ↓
GitHub Push
    ↓
Vercel Auto-Deploy (Preview + Production)
    ↓
Supabase Migrations (versioned)
    ↓
Live at eunice.yourdom.com
```

---

## Security Considerations (MVP)

- Supabase Auth for parent/admin authentication (OAuth ready for future)
- Row-level security (RLS) on database (applications visible only to own parent/assigned admin)
- HTTPS everywhere (Vercel default)
- Document uploads scanned for file type + size validation
- Email verification for parent accounts
- Admin roles enforced at API level

---

## Scalability Path (Future)

**Multi-School Tenancy**
- Add `school_id` to all entities (already in data model)
- Supabase RLS policies partition by school
- Separate subdomains or path-based routing per school

**AI/Automation (Future)**
- Document OCR (extract data from uploaded docs)
- Automated document validation (check completeness)
- Recommendation engine (flag likely incomplete applications)
- Analytics dashboard (application funnel, completion rates)

**Mobile Apps (Future)**
- React Native or Flutter
- API designed to support both web + mobile
