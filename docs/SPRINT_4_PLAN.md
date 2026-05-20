# Sprint 4 Operational & Design Plan: Detailed Design & Analysis

**Timeline:** May 25 - June 1, 2026 (1 Week / 5 Working Days)  
**Sprint Focus:** Synthesize discovery inputs, compile interactive portal mockups, and secure formal stakeholder sign-off to exit Phase 1.  
**Critical Objective:** Prepare the platform for 100% development readiness before Phase 2 build kickoff on June 1.

---

## 📅 Day-by-Day Timeline

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   MON 25    │   TUE 26    │   WED 27    │   THU 28    │   FRI 29    │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Task 4.1    │ Task 4.2    │ Task 4.3    │ Task 4.4    │ Task 4.5    │
│ Response    │ Parent      │ Admin       │ Handoff     │ Stakeholder │
│ Synthesis   │ Flows       │ Flows       │ Spec &      │ Sign-Off    │
│ & Spec      │ Design      │ Design      │ Tokens      │ Checkpoint  │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

* **May 25 (Monday):** Response Synthesis & Database State Spec
* **May 26 (Tuesday):** Parent Portal Guided UI Flows (Mobile-First)
* **May 27 (Wednesday):** Admin Dashboard & Document Auditing UI (Desktop)
* **May 28 (Thursday):** Design System Specs, Tokens, & Developer Handoff
* **May 29 - Jun 1 (Fri-Mon):** Stakeholder Interactive Walkthrough & Sign-off

---

## 🛠️ Sprint 4 Detailed Tasks

### Task 4.1: Response Synthesis & Database State Spec
* **Goal:** Process all incoming school intake workflow surveys and finalize the application database state machine schema.
* **Inputs:** Supabase `discovery_assessments` submissions and `docs/ASSESSMENT_ANALYSIS.md`.
* **Execution Steps:**
  1. Audit responses for unique school parameters (e.g., zoning criteria, sibling priority weightings, boarding restrictions).
  2. Map out the database state transitions to prevent race conditions during concurrent admin audits.
  3. Formulate the zoning area validation logic (e.g., verifying address proximity to school perimeter).
* **Deliverable:** Completed `docs/APPLICATION_STATES_SPEC.md` mapping strict SQL enum transitions.

### Task 4.2: Mobile-First Parent Portal flows
* **Goal:** Design the guided parent experience to minimize document fatigue and submission abandonment.
* **Inputs:** `docs/FIGMA_SCAFFOLDING.md` (Mobile layout specs: 375px, 4-columns).
* **Design Artboards:**
  * **P1 (Auth):** Signup with school selector, secure signin, and recovery screens.
  * **P2 (Tracker):** Active application progress visual tracker with highlighted action points (e.g., *"Birth certificate rejected - please re-upload"*).
  * **P3 (Wizard):** Guided step-by-step form (Parent details, Learner details, school zoning verification, drag-and-drop document upload).
* **Deliverable:** Interactive Mobile Prototype containing micro-annotations for validation warnings.

### Task 4.3: Desktop Admin Dashboard flows
* **Goal:** Design the core intake evaluation screen to minimize clicks and expedite administrative audits.
* **Inputs:** `docs/FIGMA_SCAFFOLDING.md` (Desktop grid specs: 1440px, 12-columns).
* **Design Artboards:**
  * **A1 (Queue):** Multi-filtering grid supporting bulk search, status pills, and sorting by submission age.
  * **A2 (Review Card):** split-screen evaluation pane. Left: learner details & timeline notes. Right: interactive PDF document viewer with verification checkboxes.
  * **A3 (Action Hub):** Quick status mutator panel that pops up pre-configured templates (e.g., email notification previews) before mutating database status.
* **Deliverable:** Clickable Desktop Prototype illustrating the full admin audit loop.

### Task 4.4: Design System Specs & Developer Handoff
* **Goal:** Finalize tokens to enable instantaneous coding during the Phase 2 build.
* **Inputs:** Complete visual assets from Tasks 4.2 & 4.3.
* **Execution Steps:**
  1. Map all visual color tokens, shadows, and glass backdrop blurs directly to Tailwind CSS class names (e.g. `backdrop-blur-md bg-white/5`).
  2. Document spacing values to enforce design system consistency.
  3. Package the Figma library symbols with all variants (Default, Hover, Focus, Active, Disabled).
* **Deliverable:** Created `docs/DESIGN_SYSTEM_HANDOFF.md` containing the developer integration specifications.

### Task 4.5: Stakeholder Walkthrough & Gate Sign-Off
* **Goal:** Conduct review loops, execute feedback adjustments, and obtain formal authorization to commence coding.
* **Inputs:** Interactive Figma prototypes (Parent & Admin) and the locked scope specification.
* **Execution Steps:**
  1. Record an asynchronous video walkthrough demonstrating the end-to-end journey.
  2. Present the layout designs to Eunice admissions staff.
  3. Log all critique notes, perform small visual refinements, and execute the sign-off checklist.
* **Deliverable:** Formal `docs/STAKEHOLDER_APPROVAL.md` marking successful graduation of Phase 1.

---

## 🔄 Daily Development Cadence & Feedback Loops

To keep velocity high and prevent scope drift:
1. **Daily Standup (15 Mins):** Quick sync to share artboard progress, cross-reference functional requirements, and resolve UX layout blocks.
2. **Mid-Sprint Review Checkpoint (Wednesday afternoon):** Share low-fidelity parent and admin flows to catch visual design and workflow misalignments early.
3. **Closing Iteration (Friday morning):** Finalize all feedback modifications and package specifications for development handoff.

---

## 🚦 Phase 1 Exit Gate Criteria (Success Indicators)
To transition to the Phase 2 Build on June 1, we must fulfill these criteria:
* [ ] Interactive prototypes cover all requirements defined in `docs/REQUIREMENTS.md`.
* [ ] Component variant details are documented for developer implementation.
* [ ] Core storage, validation, and POPIA privacy architectures are signed off.
* [ ] Formal approval is obtained from the school intake stakeholders.
