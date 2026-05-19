# Sprint 3 & 4 Plan: Async Waiting + Phase 1 Design

**Timeline:** May 20 - June 1 (2 weeks, 10 working days)  
**Phases:** Phase 0 close-out + Phase 1 (Design & Analysis)  
**Goal:** Ship MVP by July 1 → Must finish Phase 1 by June 1 to allow 4 weeks for Phase 2 development.

---

## Executive Summary

**Sprint 3 (May 20-25):** Low-risk prep work while waiting for Eunice to complete assessments. Setup design system, create mock data, spike on document handling, refine tech decisions.

**Sprint 4 (May 25-June 1):** Analyze assessment responses, identify workflow patterns, design parent portal + admin dashboard, get stakeholder sign-off.

**Delivery:** Figma mockups + interactive prototype + design system + stakeholder approval.

---

## Sprint 3: Parallel Prep (May 20-25)

**Status:** Waiting for Eunice assessment responses to return.  
**Duration:** 1 week (5 days)  
**Effort:** Medium (low-context, no blockers)

### Shared Decisions (Finalize Before Tasks Start)

1. **Design Tool:** Use Figma (free tier covers MVP scope)
2. **Design System Approach:** Build lightweight system (colors, typography, components) as Figma library
3. **Mock Data Philosophy:** Realistic Eunice data (4-5 sample applications at various stages)
4. **Document Spike Output:** Decision on file storage strategy (Supabase Storage vs. other)

---

### Task 3.1: Design System Foundation

**Goal:** Create Figma design system (colors, typography, grid, component library) so Sprint 4 can move fast.

**Context:**  
No design exists yet. Frontend is currently Tailwind + shadcn. Need to establish visual language before designing screens. This is a 1-time setup task.

**Proposed Approach:**
1. Create Figma workspace (or use existing if you have one)
2. Define color palette (match Tailwind defaults: blues, indigos, grays for a professional education app)
3. Set typography (headings, body, labels, captions)
4. Create responsive grid (8-column on mobile, 12-column on desktop)
5. Build base components (button, input, checkbox, card, modal, table)
6. Document component states (active, hover, disabled, error)

**Acceptance Criteria:**
- Figma file created and organized (Pages: Colors, Typography, Grid, Components)
- 10+ base components defined (button, input, select, checkbox, card, modal, table, badge, alert, divider)
- All components have active, hover, disabled, and (where relevant) error states
- Color palette and typography set, documented with Tailwind equivalents
- Design system is shareable and comments are enabled for feedback

**Relevant Files:**
- `/docs/REQUIREMENTS.md` (reference for component needs)
- `assessment/tailwind.config.js` (reference for color tokens)

**Verify:**
- [ ] Figma link shared and accessible
- [ ] All base components visible and properly grouped
- [ ] Design system matches Tailwind defaults (low friction during dev)
- [ ] Ready to be applied to wireframes in Sprint 4

**Time Estimate:** 4-5 hours  
**Out of Scope:** Animated interactions, micro-interactions, accessibility audit (do in Sprint 4)

---

### Task 3.2: Document Handling Spike & Tech Decision

**Goal:** Decide on document upload/storage strategy and document validation approach before building.

**Context:**  
Parents upload documents (birth certificate, school reports, ID, proof of residence). Need to decide:
- Where files are stored (Supabase Storage? AWS S3? Cloud Storage?)
- How files are validated (client-side format + size check? server-side virus scan?)
- How admin views/downloads documents
- Compliance (POPIA, data retention)

This is a risk: getting it wrong means rewriting upload flow in Phase 2.

**Proposed Approach:**
1. Research Supabase Storage capabilities:
   - Max file size limits
   - Bandwidth costs
   - Security (signed URLs, RLS policies)
   - Integration with Next.js file upload
2. Research document validation options:
   - Client-side: File type check (PDF, JPG, PNG), size (5MB)
   - Server-side: Optional virus scan (ClamAV? AWS Macie?) — likely overkill for MVP
3. Create simple flowchart: Parent uploads → validation → storage → admin retrieval
4. Decide: Go with Supabase Storage (simple, integrated) or defer to Phase 2

**Acceptance Criteria:**
- [ ] Written decision document (1-2 pages): Which storage solution, why
- [ ] Document validation rules defined (accepted types, max size, client vs. server checks)
- [ ] Flowchart drawn (parent upload → storage → admin download)
- [ ] Identified compliance concerns (POPIA data retention, deletion policies)
- [ ] No blockers identified for Phase 2 build

**Relevant Files:**
- `/docs/ARCHITECTURE.md` (reference for tech stack decisions)
- `/docs/REQUIREMENTS.md` (document type requirements from admin/parent flows)

**Verify:**
- [ ] Decision document exists and is clear
- [ ] Dev team (you) can execute this in Phase 2 without re-deciding
- [ ] No ambiguity on compliance or security approach

**Time Estimate:** 3-4 hours  
**Out of Scope:** Implementing document upload (Phase 2), virus scanning, multi-part uploads

---

### Task 3.3: Mock Data Schema & Sample Applications

**Goal:** Create realistic sample application data (4-5 scenarios) to use in wireframes and testing.

**Context:**  
Phase 4 design will reference real data. Need sample applications at various stages (pending, incomplete, submitted, under review, accepted) to design realistic admin dashboard views.

**Proposed Approach:**
1. Define mock application data shape (parent info, learner info, documents, status, timeline)
2. Create 5 sample applications:
   - **App 1:** Complete, accepted (all docs uploaded, verified)
   - **App 2:** Incomplete (missing document flagged)
   - **App 3:** Under review (awaiting admin decision)
   - **App 4:** Pending (just submitted, not yet reviewed)
   - **App 5:** Rejected (decision made)
3. Create realistic names, grades, scenarios based on a South African school context
4. Document in JSON or SQL so it can be seeded into Supabase in Phase 2

**Acceptance Criteria:**
- [ ] 5 sample applications created with realistic data
- [ ] Each application has complete data (parent, learner, documents, status, timeline)
- [ ] Data file is documented (schema, sample output)
- [ ] Ready to load into Supabase for Phase 2 testing
- [ ] Names, grades, scenarios are contextually appropriate (South African context)

**Relevant Files:**
- `/docs/REQUIREMENTS.md` (reference for application form fields)
- `assessment/` (reference for school intake data structure)

**Verify:**
- [ ] Sample data file in `/assessment/mock-data.json` or similar
- [ ] Schema documented
- [ ] Data is realistic and covers all status scenarios
- [ ] Ready for seeding in Phase 2

**Time Estimate:** 2-3 hours  
**Out of Scope:** Loading into database (Phase 2), generating 100+ applications

---

### Task 3.4: Figma Prototype Scaffolding

**Goal:** Create empty wireframe artboards in Figma, organized by user flow (parent portal, admin dashboard).

**Context:**  
Sprint 4 will design detailed screens. This task sets up the structure so Sprint 4 can focus on design decisions, not Figma organization.

**Proposed Approach:**
1. Create Figma pages (one per major flow):
   - Auth (Signup, Login, Password Reset)
   - Parent Portal (Dashboard, Start App, Form Steps, Upload Docs, Review, Status Tracking)
   - Admin Dashboard (List, Detail, Status Update, Notes, Reports)
2. Create artboards for each screen (name them clearly: "Parent – Start App", "Admin – List", etc.)
3. Apply design system baseline (grid, colors, typography)
4. Add notes to each artboard with TODO comments for Sprint 4
5. Share prototype link with stakeholders (so they can comment)

**Acceptance Criteria:**
- [ ] Figma file has organized pages and artboards
- [ ] All major screens from REQUIREMENTS.md are represented
- [ ] Design system applied to artboards (grid visible, colors/type available)
- [ ] Prototype is shareable and commenting is enabled
- [ ] Ready for detailed wireframe design in Sprint 4

**Relevant Files:**
- `/docs/REQUIREMENTS.md` (reference for all screens needed)
- Figma design system created in Task 3.1

**Verify:**
- [ ] All major user flows have artboards
- [ ] Prototype link works and comments are enabled
- [ ] Sprint 4 designer can jump in and start designing without re-organizing

**Time Estimate:** 2-3 hours  
**Out of Scope:** Detailed design, interactive prototype, component instances (Phase 4)

---

### Task 3.5: Assess Assessment Responses (As They Arrive)

**Goal:** Start analyzing Eunice assessment submissions as they arrive. Identify workflow patterns early.

**Context:**  
If Eunice staff submit the assessment form during Sprint 3, capture key insights immediately. Don't wait until Sprint 4 to start analyzing.

**Proposed Approach:**
1. Each time a response arrives, scan for:
   - Current workflow (step-by-step process)
   - Pain points (ranked by frequency/impact)
   - Key roles (who does what)
   - Required documents
   - Application states they track
   - Tools in use
   - Priorities for new system
2. Keep a running document: `docs/ASSESSMENT_ANALYSIS.md`
3. Update trends weekly (don't re-analyze each one, just append key learnings)

**Acceptance Criteria:**
- [ ] Assessment responses reviewed as they arrive
- [ ] Key insights captured in `docs/ASSESSMENT_ANALYSIS.md`
- [ ] Trends identified (common pain points, document types, workflow states)
- [ ] Ready to inform design decisions in Sprint 4

**Relevant Files:**
- Supabase `discovery_assessments` table (live data)
- `docs/ASSESSMENT_ANALYSIS.md` (create this)

**Verify:**
- [ ] At least 1-2 responses analyzed (if available)
- [ ] Analysis document created and updated
- [ ] Insights will directly inform Sprint 4 design (document types, workflow states, priorities)

**Time Estimate:** 1-2 hours total (ongoing, low burn)  
**Out of Scope:** Full statistical analysis (do in Sprint 4 if needed)

---

## Sprint 4: Phase 1 Design & Analysis (May 25 - June 1)

**Status:** Assessment responses returned from Eunice.  
**Duration:** 1 week (5 days)  
**Effort:** High (design-heavy, collaborative)

### Shared Decision: Design Review Cadence

- **Daily standup:** 15 min (share progress, flag blockers)
- **Design review:** Wed/Thu with stakeholder (Eunice principal or admissions staff if available)
- **Iteration:** Fri (incorporate feedback, finalize designs for handoff)

---

### Task 4.1: Analyze Assessment Responses & Extract Requirements

**Goal:** Synthesize assessment responses into detailed workflow diagram and prioritized feature list.

**Context:**  
Sprint 3 started capturing insights. Sprint 4 completes deep analysis. Output is the foundation for all design decisions.

**Proposed Approach:**
1. Consolidate all assessment responses (assume 1-3 responses from Eunice)
2. Extract key data:
   - Current workflow (detailed step-by-step)
   - Application statuses they track (e.g., Submitted, Under Review, Approved, Rejected, Waitlisted)
   - Required documents (birth cert, school report, proof of residence, ID)
   - Stakeholders & roles (who reviews, who approves, who contacts parents)
   - Pain points (ranked by severity: manual data entry, lost documents, parent confusion, etc.)
   - Current tools (Google Forms, email, sheets, etc.)
   - Top priorities for new system (automation, visibility, efficiency)
3. Create workflow diagram (flowchart): Application submitted → review → decision → parent notification
4. Define application state machine (all states, transitions, who triggers each)
5. Create stakeholder map (roles, responsibilities, decision points)

**Acceptance Criteria:**
- [ ] Assessment analysis document (2-3 pages): key findings, trends, priorities
- [ ] Workflow diagram (flowchart, visual): current and future state (if different)
- [ ] Application state machine (state diagram): all states, transitions
- [ ] Stakeholder map: roles, responsibilities, decision authority
- [ ] Prioritized feature list (what's MVP, what's future)
- [ ] No ambiguity on required documents, application states, or workflow

**Relevant Files:**
- Supabase `discovery_assessments` table (live response data)
- `/docs/REQUIREMENTS.md` (reference)
- `/docs/ASSESSMENT_ANALYSIS.md` (from Sprint 3)

**Verify:**
- [ ] Workflow diagram reviewed with stakeholder (if available)
- [ ] Application states agree with Eunice's current process
- [ ] Required documents list is complete
- [ ] Feature prioritization is clear (MVP vs. future)

**Time Estimate:** 6-8 hours  
**Out of Scope:** Building the system, compliance analysis (note but defer), detailed error handling (Phase 2)

---

### Task 4.2: Design Parent Portal Flows (Wireframes + Prototype)

**Goal:** Design parent-facing flows: signup, application creation, document upload, status tracking.

**Context:**  
This is the primary user-facing product. Must be mobile-first, intuitive, and minimize friction.

**Proposed Approach:**
1. **Wireframes (Low-fidelity):** For each flow, sketch screens in Figma:
   - Auth: Signup → Email verification → Login → Password reset
   - New Application: Start → Multi-step form (parent info → learner info → academic details → docs → review → submit)
   - Document Upload: Upload interface → drag-and-drop → progress → confirmation
   - Status Tracking: Application dashboard → status badge → document checklist → communication history
   - Notifications: Badge, in-app alerts, email prompts

2. **Mobile-first:** Design for small screens (375px). Ensure forms are vertical, inputs are large, buttons are tappable (48px+)

3. **Interactive Prototype:** Convert wireframes to clickable prototype in Figma (link flows: signup → dashboard → start app, etc.)

4. **Annotation:** Add notes to each screen (field labels, validation rules, help text)

**Acceptance Criteria:**
- [ ] All major parent flows have wireframes (auth, app creation, upload, tracking)
- [ ] Mobile-first design (tested at 375px breakpoint)
- [ ] Interactive prototype created (parent can click through full journey)
- [ ] Field-level annotations (labels, placeholders, validation, help text)
- [ ] Prototype tested on stakeholder feedback (if available)
- [ ] Accessibility notes added (color contrast, font sizes, labels)

**Relevant Files:**
- Figma design system (from Sprint 3, Task 3.1)
- Figma prototype scaffold (from Sprint 3, Task 4)
- `/docs/REQUIREMENTS.md` (parent portal flows)
- `docs/ASSESSMENT_ANALYSIS.md` (workflow insights)

**Verify:**
- [ ] Figma prototype link shared and accessible
- [ ] All screens clickable and flows connect
- [ ] Mobile responsiveness confirmed (no horizontal scroll, readable text)
- [ ] Stakeholder feedback captured (if review done)

**Time Estimate:** 10-12 hours  
**Out of Scope:** Visual design polish (colors, shadows, animations), dev handoff specs (Phase 2), accessibility audit (Phase 2)

---

### Task 4.3: Design Admin Dashboard Flows (Wireframes + Prototype)

**Goal:** Design admin-facing flows: application list, detail view, status management, notes, communication.

**Context:**  
Admissions staff spend 2-3 hours/day managing applications. Dashboard must make this efficient.

**Proposed Approach:**
1. **Wireframes:** Design admin screens:
   - Dashboard: Overview (pending count, recent apps, alerts)
   - Application List: Table with filters (by status, date, search), sorting, pagination
   - Application Detail: Full application card (parent info, learner info, documents, timeline)
   - Document Review: Modal/panel showing document with verify/reject options
   - Status Update: Change status → auto-trigger email template selection
   - Notes: Internal notes section (timestamps, author)
   - Bulk Actions: Select multiple apps, change status in bulk (future, but design for it)
   - Export: Generate CSV report

2. **Responsive Design:** Optimize for desktop (1280px+) but ensure mobile fallback (table becomes card view)

3. **State Design:** Show all states (empty state, loading, error, success, bulk selection)

4. **Interactive Prototype:** Connect flows (list → detail → status update → confirmation)

**Acceptance Criteria:**
- [ ] All admin flows have wireframes (list, detail, status, notes, export)
- [ ] Table design handles 50+ applications (pagination clear)
- [ ] Filter and search UI intuitive (not overwhelming)
- [ ] Status update flow is minimal clicks (current: show template options)
- [ ] Empty, loading, error, success states designed
- [ ] Interactive prototype created and tested
- [ ] Document review interface is clear (thumbnail + verify/reject buttons)

**Relevant Files:**
- Figma design system
- Figma prototype scaffold
- `/docs/REQUIREMENTS.md` (admin dashboard flows)
- `docs/ASSESSMENT_ANALYSIS.md` (workflow, documents, roles)

**Verify:**
- [ ] Figma prototype link works and is shareable
- [ ] All screens connected in prototype (can navigate from list → detail → status update)
- [ ] Table/list design confirmed to work with 50+ items
- [ ] Stakeholder feedback captured (esp. from admissions staff, if available)

**Time Estimate:** 10-12 hours  
**Out of Scope:** Reporting/analytics dashboard (Phase 4), bulk operations UI detail (Phase 2), permission/role design (Phase 2)

---

### Task 4.4: Finalize Design System & Create Component Specs

**Goal:** Complete design system with all components used in prototypes, document for developer handoff.

**Context:**  
Dev needs to know exact spacing, colors, typography, and component behavior to build efficiently.

**Proposed Approach:**
1. Audit prototypes (Tasks 4.2 & 4.3): Identify all components used
2. Create component specs in Figma:
   - **Buttons:** Primary, secondary, danger, disabled states, sizes (small, medium, large)
   - **Forms:** Input, select, checkbox, radio, textarea, file upload
   - **Tables:** Header, row, sortable columns, pagination
   - **Modals:** Header, body, footer, close button
   - **Cards:** Container, padding, shadow, hover state
   - **Status badges:** Pending, submitted, under review, accepted, rejected (match states from analysis)
   - **Alerts:** Info, warning, error, success
   - **Navigation:** Tabs, breadcrumbs, sidebar

3. Document properties for each component:
   - Dimensions (width, height, padding)
   - Colors (background, border, text)
   - Typography (font, size, weight, line-height)
   - Spacing (margin, gap)
   - States (default, hover, active, disabled, focus)

4. Create developer handoff guide (1 page): Design system philosophy, color tokens, spacing scale, component library link

**Acceptance Criteria:**
- [ ] All components used in prototypes have full specs (Figma and/or documented)
- [ ] Color tokens mapped to Tailwind (so dev doesn't guess)
- [ ] Typography scales documented (heading sizes, body sizes)
- [ ] Spacing scale consistent (8px, 16px, 24px, etc.)
- [ ] Component states clear (hover, active, disabled, error, loading)
- [ ] Developer handoff guide (1-page PDF or markdown) ready for Phase 2

**Relevant Files:**
- Figma design system file
- Figma prototypes (from 4.2, 4.3)
- `/docs/DESIGN_SYSTEM.md` (create for dev reference)

**Verify:**
- [ ] Developer (you, in Phase 2) can code components without re-interpreting design
- [ ] No ambiguity on colors, spacing, or component behavior
- [ ] Tailwind config can be generated from design tokens

**Time Estimate:** 4-5 hours  
**Out of Scope:** Animation specs (Phase 2 decision), detailed accessibility guidelines (Phase 2)

---

### Task 4.5: Stakeholder Review & Sign-Off

**Goal:** Present designs to Eunice stakeholders (principal, admissions staff), gather feedback, iterate, get approval to proceed to Phase 2.

**Context:**  
Eunice needs to confirm that designs match their workflow and priorities. Getting sign-off now prevents re-work in Phase 2.

**Proposed Approach:**
1. **Prepare Review Package:**
   - Short video walkthrough of parent portal (2-3 min)
   - Short video walkthrough of admin dashboard (2-3 min)
   - Figma prototype links (interactive for self-exploration)
   - Document: Design rationale (why these flows, how they address pain points)

2. **Review Session (45-60 min):**
   - Walk through parent workflow (parent's POV)
   - Walk through admin workflow (staff's POV)
   - Ask: Does this match your process? What's missing? What would you change?
   - Capture feedback (video/notes)

3. **Iteration (1-2 days):**
   - Analyze feedback
   - Prioritize changes (critical vs. nice-to-have)
   - Update designs (should be 1-2 small tweaks, not major reworks)
   - Re-share with stakeholders (async: "We updated X and Y based on your feedback")

4. **Sign-Off:**
   - Formal agreement: "Approved to move to Phase 2 development"
   - Document: Stakeholder sign-off (email, form, or signed doc)

**Acceptance Criteria:**
- [ ] Review package prepared (video walkthrough + prototype link + rationale doc)
- [ ] Stakeholder review completed (meeting or async feedback)
- [ ] Feedback documented (what changes, why)
- [ ] Designs iterated based on critical feedback
- [ ] Stakeholder sign-off obtained (documented approval to proceed)
- [ ] Design assets handed off to Phase 2 (Figma link, component specs, design system)

**Relevant Files:**
- Figma prototypes (from 4.2, 4.3)
- `/docs/DESIGN_HANDOFF.md` (create for Phase 2)
- `/docs/ASSESSMENT_ANALYSIS.md` (reference for design rationale)

**Verify:**
- [ ] Stakeholder has reviewed and approved designs
- [ ] All critical feedback incorporated
- [ ] Design system, prototypes, and specs are ready for developer (Phase 2)
- [ ] No blockers for Phase 2 kickoff

**Time Estimate:** 4-6 hours (including iteration)  
**Out of Scope:** Detailed QA specs (Phase 2), accessibility audit (Phase 2), performance design (Phase 2)

---

## Phase 1 Handoff to Phase 2

**Deliverables (End of Sprint 4):**

1. **Figma Design System**
   - Colors, typography, grid
   - 15+ component definitions
   - Status badges, form elements, modals, cards, tables

2. **Figma Prototypes**
   - Parent portal: 8-10 screens, interactive flows
   - Admin dashboard: 10-12 screens, interactive flows

3. **Analysis Documents**
   - `docs/ASSESSMENT_ANALYSIS.md`: Workflow, pain points, priorities
   - `docs/APPLICATION_STATES.md`: State machine diagram
   - `docs/REQUIRED_DOCUMENTS.md`: Document types, why needed
   - `docs/STAKEHOLDER_MAP.md`: Roles, responsibilities, decision points

4. **Design System Specs**
   - `docs/DESIGN_SYSTEM.md`: Color tokens, spacing, typography, components
   - Figma component library (linked)

5. **Design Handoff Package**
   - `docs/DESIGN_HANDOFF.md`: Prototype links, component specs, notes for developer
   - Video walkthrough (2x, 5-7 min total)

6. **Stakeholder Approval**
   - Email/document: Design sign-off from Eunice principal or admissions lead

---

## Risk Register (Sprints 3-4)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Eunice assessment responses delayed | Medium | Delays Sprint 4 analysis | Assume 1-2 responses minimum; start with generic patterns if needed |
| Design feedback requires major rework | Low | Delays Phase 2 | Design review with stakeholders mid-Sprint 4 (Wed/Thu) |
| Stakeholder unavailable for sign-off | Medium | Blocks Phase 2 start | Begin design review early (Wed), not Fri |
| Figma learning curve slows design | Low | Time overrun | Use Figma templates, keep designs simple (wireframes, not high-fidelity) |
| Scope creep (stakeholder wants more) | Medium | Delays timeline | Clarify: Phase 1 = design only, Phase 2 = build, Phase 4 = enhancements |

---

## Success Criteria (End of Sprints 3-4)

**Sprint 3:**
- [ ] Design system created (10+ components, colors, typography)
- [ ] Document handling spike complete (storage decision documented)
- [ ] Mock data created (5 sample applications)
- [ ] Figma prototype scaffolding ready
- [ ] Assessment responses analyzed as they arrive

**Sprint 4:**
- [ ] Workflow analysis complete (states, roles, documents identified)
- [ ] Parent portal designs done (8-10 screens, interactive)
- [ ] Admin dashboard designs done (10-12 screens, interactive)
- [ ] Design system finalized (component specs, tokens, docs)
- [ ] Stakeholder review & sign-off obtained
- [ ] All design assets ready for Phase 2 developer

**Overall (Phase 1 Gate):**
- Stakeholders confirm designs match their workflow
- No critical feedback outstanding
- Figma prototypes are interactive and fully documented
- Developer can estimate Phase 2 effort based on designs
- Ready to start MVP build on June 1

---

## Notes for Day-to-Day

- **Async-friendly:** Sprint 3 is mostly individual work (design system, spike, mock data). Use async Figma comments if stakeholder input is needed.
- **Cadence:** Sprint 4 is design-heavy and collaborative. Daily standups + mid-sprint stakeholder review keep momentum.
- **Feedback loops:** Get stakeholder eyes on designs by Wednesday of Sprint 4 so Friday can be final iteration.
- **Design-first mindset:** Don't jump to code. Let design uncover UX gaps early (cheaper to fix in Figma than React).
- **Scope discipline:** Phase 1 is design only. Document nice-to-haves as "Phase 4" features.
