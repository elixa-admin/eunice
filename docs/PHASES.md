# Development Phases

## Phase 0 — Discovery & Workflow Mapping ⭐ CRITICAL

**Status:** In progress (workflow reconnaissance completed on 2026-05-21 to 2026-05-22; stakeholder sign-off pending)  
**Duration:** 1-2 weeks  
**Effort:** High (foundational)

### Objectives
This is the **MOST important phase**. No code until this is complete.

- Document current admissions workflows (detailed process flows)
- Identify operational pain points (specific bottlenecks)
- Map stakeholders (principal, admin staff, parents, students)
- Define application states and transitions
- Identify repetitive manual processes
- Understand document requirements
- Validate scope with Eunice stakeholders
- Identify constraints (compliance, policy, existing systems)

### Deliverables
- [ ] Current workflow documentation (flowcharts, written descriptions)
- [ ] Pain point analysis (ranked by impact)
- [ ] Stakeholder map and interview notes
- [ ] Application state diagram
- [ ] Document checklist (what documents are required, why)
- [ ] Scope sign-off with Eunice stakeholders
- [ ] Risk assessment

### Approach
- Stakeholder interviews (principal, admissions staff, parents, students)
- Observe current process firsthand
- Document Google Forms, email templates, spreadsheets in use
- Map existing data and workflows
- Identify edge cases and special workflows

### Success Criteria
- Eunice stakeholders confirm the workflow documentation is accurate
- All pain points prioritized and ranked
- Clear understanding of why manual processes exist (not just "they do")
- Scope agreed upon (what's in MVP, what's future)

---

## Phase 1 — UX/UI Prototype

**Status:** In progress (applied through `dev/` preview slices and UI polish passes; formal prototype sign-off pending)  
**Duration:** 1-2 weeks  
**Effort:** Medium

### Objectives
- Design parent application journey
- Design admin dashboard workflow
- Validate workflow in design phase (catch UX issues early)
- Create wireframes + interactive prototypes
- Test mobile-first approach

### Deliverables
- [ ] Parent portal wireframes (mobile-first)
  - Home/login
  - Application start
  - Multi-step form
  - Document upload
  - Review & submit
  - Status tracking
  - Notifications

- [ ] Admin dashboard wireframes
  - Application list with filters
  - Individual application detail
  - Document review
  - Status management
  - Notes
  - Bulk operations (remind, update status)
  - Reports/export

- [ ] Interactive prototype (Figma or similar)
- [ ] Mobile responsiveness validation
- [ ] Stakeholder feedback & iterations
- [ ] Design system foundation (colors, typography, components)

### Success Criteria
- Parent and admin workflows feel intuitive and low-friction
- Mobile experience validated on older devices
- Stakeholders approve designs
- Design system ready to hand off to development

---

## Phase 2 — MVP Development

**Status:** In progress (early foundation and workflow slices underway; Sprint D UX hardening in progress as of 2026-06-03)  
**Duration:** 3-4 weeks  
**Effort:** High

### Objectives
- Build functional MVP based on Phase 0 & 1
- Establish tech stack and deployment pipeline
- Create production-ready (not beta) application

### Deliverables

**Parent Portal**
- [ ] Authentication (email signup/login)
- [ ] Application form (multi-step, save-and-return)
- [ ] Document upload (with validation)
- [ ] Application review & submission
- [ ] Application status tracking
- [ ] Email communication history

**Admin Dashboard**
- [ ] Authentication (admin login, role-based access)
- [ ] Application list (filterable, searchable)
- [ ] Individual application detail view
- [ ] Document review interface
- [ ] Status management (change status, trigger emails)
- [ ] Internal notes
- [ ] Data export (CSV)
- [ ] Missing document tracking & reminder triggers

**Backend & Infrastructure**
- [ ] Supabase setup (database schema, auth, storage)
- [ ] API endpoints (all parent + admin operations)
- [ ] Email automation (Resend integration)
- [ ] Background jobs (Vercel Cron for scheduled reminders)
- [ ] Vercel deployment pipeline
- [ ] Database migrations & seeding

**Testing & Quality**
- [ ] Unit tests (core business logic)
- [ ] Integration tests (API endpoints)
- [ ] Manual testing (all user flows)
- [ ] Performance testing (load on older devices, poor connectivity)
- [ ] Security audit (auth, data access, input validation)

### Success Criteria
- MVP is feature-complete per Phase 1 design
- Parent can apply, upload documents, track status end-to-end
- Admin can manage all applications, send communications, view reports
- System is performant on older Android devices with poor connectivity
- Zero data loss, secure authentication
- Deployment is automated (push to GitHub → deploy to Vercel)

---

## Phase 3 — Pilot Deployment at Eunice

**Status:** Not started  
**Duration:** 4-6 weeks  
**Effort:** High (ongoing support)

### Objectives
- Deploy MVP to production at Eunice High School
- Run 1 full admissions cycle with the system
- Gather user feedback from parents and admissions staff
- Validate operational improvement claims
- Identify workflow gaps and refinement opportunities
- Measure administrative burden reduction

### Deliverables
- [ ] Production environment setup
- [ ] Data migration from existing system (if applicable)
- [ ] Staff training (admissions team)
- [ ] Parent communication & launch (email, SMS, posters)
- [ ] Support infrastructure (help email, basic troubleshooting)
- [ ] Daily monitoring (error logs, performance, uptime)
- [ ] Weekly feedback collection (staff + parents)
- [ ] Feedback analysis & prioritization
- [ ] Rapid fixes & refinements (bug fixes, small UX improvements)
- [ ] Post-pilot report (metrics, feedback, recommendations)

### Success Criteria
- System operates reliably throughout admissions cycle (99.9% uptime)
- Parent experience is positive (NPS ≥ 7/10, positive feedback)
- Admin workload is visibly reduced (staff report less manual work)
- Zero data integrity issues
- All critical bugs fixed within 24 hours
- Quantifiable metrics: time saved, applications processed, documents managed

### Key Metrics to Track
- Applications received
- Average time to completion (parent side)
- Time saved per application (admin side)
- Document upload success rate
- Email delivery success rate
- Parent satisfaction
- Admin satisfaction
- System uptime
- Response times

---

## Phase 4 — Optimisation & Scaling

**Status:** Future  
**Duration:** Ongoing  
**Effort:** Medium (per iteration)

### Potential Enhancements (Priority Order)

**Short-term (2-3 months post-pilot)**
- [ ] Performance optimizations based on pilot data
- [ ] UX refinements from user feedback
- [ ] Admin reporting dashboard (analytics, metrics)
- [ ] Bulk operations (batch status updates, bulk email)
- [ ] Document categorization & search
- [ ] Application form customization (per school)

**Medium-term (3-6 months)**
- [ ] WhatsApp integration (automated reminders via WhatsApp)
- [ ] Mobile app (React Native or Flutter)
- [ ] SMS notifications
- [ ] Workflow customization UI (admins define their own states/process)
- [ ] Multi-user admin (role-based access, activity logs)

**Long-term (6+ months, SaaS evolution)**
- [ ] Multi-school tenancy (one platform, multiple schools)
- [ ] AI-assisted document validation (OCR, completeness checking)
- [ ] Predictive analytics (application approval recommendations)
- [ ] Integration with school ERP (sync accepted applicants)
- [ ] Provincial education network (interconnected workflows)
- [ ] SaaS commercialisation (pricing, billing, multi-tenant operations)

### Future Vision
The MVP is foundational for a broader education workflow platform:
- Admissions → Student onboarding → Attendance → Reporting
- Multi-school network with federated admissions
- AI-assisted operations across all workflows
- Data insights for school management

---

## Timeline Overview

```
Week 1-2:   Phase 0 (Discovery & Workflow Mapping)
Week 3-4:   Phase 1 (UX/UI Prototype)
Week 5-8:   Phase 2 (MVP Development)
Week 9-14:  Phase 3 (Pilot Deployment @ Eunice)
Week 15+:   Phase 4 (Optimisation & Scaling)

Total MVP Timeline: ~3.5 months (Phase 0-3)
```

---

## Success Definition (by Phase)

| Phase | Success Looks Like |
|-------|-------------------|
| Phase 0 | Stakeholders confirm workflows are documented accurately, scope is clear |
| Phase 1 | Designs approved by stakeholders, mobile experience validated |
| Phase 2 | MVP is feature-complete, performant, secure, deployed |
| Phase 3 | Pilot succeeds, admissions cycle completes, users are satisfied, metrics improve |
| Phase 4 | System scales to multiple schools, SaaS model is validated |
