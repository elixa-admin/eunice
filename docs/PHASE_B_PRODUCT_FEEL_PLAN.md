# Phase B Plan: Product Feel + Trust Layer

Date: 2026-05-22

## Goal
Make the Eunice admissions platform feel like a polished, trustworthy product rather than a scaffold, while preserving the intake model and document rules already established.

## Context
The intake-role and document-orchestration sprint is complete. We have also reviewed comparable South African school admissions flows and extracted the useful patterns:

- staged journey
- visible progress
- human support cues
- role-aware intake
- conditional documents
- clear expectation-setting for next steps

Eunice should keep its unique requirements, but the UI and journey should feel guided, premium, and calm.

## Shared Decisions

- Keep Phase B focused on product feel, not more intake logic.
- Treat the school’s second assessment as a future refinement input, not a blocker.
- Use short deterministic implementation cycles.
- Persist decisions and unresolved issues in checkpoint markdown files after each meaningful slice.
- Prefer parent portal polish first, then admin polish, then consistency and brand tuning.

## Task 1: Parent Portal Visual Hierarchy

### Goal
Make the parent portal read like a real admissions dashboard immediately.

### Context
The parent portal is the most visible trust surface. It needs clearer hierarchy, stronger status presentation, and a more complete visual rhythm.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/globals.css`

### Proposed approach
- Strengthen the hero/status band.
- Improve card contrast and spacing.
- Make the next-step area feel more intentional.
- Add stronger empty and upload-state treatment where needed.

### Acceptance criteria
- The parent dashboard feels obviously more finished than the previous scaffold.
- The status and next-step areas are easy to identify at a glance.
- The page remains calm and readable on smaller screens.

### Verify
- Open the branch preview in a browser and inspect the parent portal on desktop and mobile widths.

### Out of scope
- Backend data changes.
- New business logic for admissions rules.

## Task 2: Admin Dashboard Operational Polish

### Goal
Make the admin surface feel like an operational admissions workspace.

### Context
The admin dashboard should communicate queue health, review posture, and actionability without feeling technical or sparse.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx`

### Proposed approach
- Strengthen the header/status composition.
- Improve the queue summary and action blocks.
- Make document and review states feel more operational.

### Acceptance criteria
- The admin dashboard looks materially different from the earlier scaffold.
- Queue and status information reads clearly without extra explanation.
- The layout still works cleanly at common desktop widths.

### Verify
- Open the branch preview and review the admin page visually.

### Out of scope
- Changing the review workflow itself.
- Adding new admin permissions or data models.

## Task 3: Brand and Trust Consistency

### Goal
Align the visual language across landing, parent, and admin surfaces.

### Context
The platform should feel like one product, not three loosely connected pages.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/layout.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/nav.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/globals.css`

### Proposed approach
- Tighten typography and spacing consistency.
- Make trust cues and admissions language feel uniform.
- Reduce any page that still feels too generic or too thin.

### Acceptance criteria
- The experience feels visually coherent across the main surfaces.
- The brand tone is warm and admissions-focused, not generic dashboard chrome.

### Verify
- Compare landing, parent, and admin pages side by side in the preview.

### Out of scope
- Rebranding the school identity itself.
- Full design-system overhaul.

## Task 4: Phase Handoff and Next Input Readiness

### Goal
Leave a clean handoff for the next major milestone and for the school’s second assessment.

### Context
We want the next session to start from a clear checkpoint, not from memory.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/CHECKPOINT_PHASE_B_2026-05-22.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_NEXT_INTAKE_UX.md`

### Proposed approach
- Record what changed, what still feels light, and what should wait for the school’s next input.
- Mark the current phase boundary clearly.

### Acceptance criteria
- The checkpoint reflects the current UI and decisions.
- The next phase is easy to resume in a fresh session.

### Verify
- Review the checkpoint markdown after the final Phase B slice.

### Out of scope
- Changing application requirements based on speculation.

## Recommended Order
1. Parent portal visual hierarchy.
2. Admin dashboard operational polish.
3. Brand and trust consistency.
4. Checkpoint update and fresh-session handoff.

