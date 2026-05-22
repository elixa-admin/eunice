# Phase D Plan: Data and Flow Hardening

Date: 2026-05-22

## Goal
Turn the current product-feel work into a durable admissions system by tightening the data model, persistence rules, workflow states, and source-of-truth boundaries across `src/`, `dev/`, and `supabase/`.

## Context
The platform now has enough visual polish to feel like a real product. The next risk is drift:

- the parent and admin surfaces must keep sharing the same role and document rules
- the preview surface must not diverge from the product model
- the application, document, and review states must be stored consistently
- the theme work must not hide underlying data or workflow fragility

This phase is about making the current design and workflow resilient enough for real use.

## Shared Decisions

- Keep the public/admin visual split from Phase C.
- Do not add new admissions policy logic unless Eunice confirms it.
- Prefer one canonical model for role, document, and application state.
- Keep the preview and product surfaces aligned to the same domain contracts.
- Use short slices, each ending with a checkpoint update.

## Task 1: Canonical Data Model Consolidation

### Goal
Make the role, document, and application entities authoritative and reusable everywhere.

### Context
We already discovered that submitter, parent, guardian, legal guardian, and fee-payer should not be collapsed into one generic bucket.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/intake-roles.ts`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/supabase/migrations`

### Proposed approach
- Define a single, stable shape for the admissions record.
- Ensure every role can be optional or conditional where appropriate.
- Keep application status and document status distinct.

### Acceptance criteria
- Role meaning is consistent across parent, admin, and data layers.
- Documents and statuses can be represented without workaround values.
- New fields have a clear home instead of being duplicated.

### Verify
- Compare the data shape against the live Eunice intake findings and current UI usage.

### Out of scope
- New UI styling.
- Launch communications.

## Task 2: Persistence and Draft Safety

### Goal
Make save-and-return behavior and application persistence trustworthy.

### Context
Parents need the confidence that progress will survive interruptions, device switches, and partial completion.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/supabase.ts`

### Proposed approach
- Ensure draft updates are consistent and resumable.
- Keep autosave semantics simple and predictable.
- Make local and remote state transitions explicit.

### Acceptance criteria
- A draft can be resumed without ambiguity.
- Save states are visible and reliable.
- The application does not lose role or document context on refresh.

### Verify
- Reopen an in-progress application flow and confirm the saved state is restored correctly.

### Out of scope
- Email automation.
- Pilot communications.

## Task 3: Workflow State Alignment

### Goal
Make parent and admin workflow states describe the same reality.

### Context
Right now the UI has improved, but the application, document, and review states still need one clear meaning across surfaces.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/validation.ts`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts`

### Proposed approach
- Define which states are blocking, which are review-only, and which are ready.
- Make the admin queue and parent status language align.
- Remove state names that are too technical or ambiguous for parents.

### Acceptance criteria
- The same application reads the same way in both parent and admin views.
- Blocking, review-only, and ready states are clear and consistent.
- Status transitions do not require interpretation by staff.

### Verify
- Walk one application through the full state model on both sides.

### Out of scope
- Branding changes.
- New workflows outside admissions.

## Task 4: Preview and Product Boundary Hygiene

### Goal
Prevent the preview surface from drifting away from the real product surface.

### Context
The repo already treats `src/` and `dev/` differently. Phase D should reinforce that separation while keeping shared contracts stable.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_CONTINUITY.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PHASE_C_THEME_SPLIT_PLAN.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev`

### Proposed approach
- Keep shared domain rules in shared libraries.
- Keep preview-only presentation isolated.
- Record any source-of-truth boundary exceptions explicitly.

### Acceptance criteria
- Shared contracts are not copy-pasted between surfaces.
- Preview work remains safe and clearly separated from product logic.
- The next session can tell which surface is authoritative for which concern.

### Verify
- Review the shared imports and preview structure after the phase slice.

### Out of scope
- Redesigning the theme again.

## Recommended Order
1. Canonical data model consolidation.
2. Persistence and draft safety.
3. Workflow state alignment.
4. Preview and product boundary hygiene.

