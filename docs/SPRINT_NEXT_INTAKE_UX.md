# Sprint: Intake Role Model + Document Orchestration

## Status
Completed and wrapped. The live Eunice intake structure is now reflected in the repo, the Vercel preview, and the active planning notes. The next phase is the product-feel sprint.

## Objective
Turn the live Eunice intake findings into a cleaner product flow that captures the real admissions structure without copying the Google Form literally. The sprint should make submitter, parent, legal guardian, and fee-payer roles explicit, keep documents authoritative in one place, and reduce duplicate or irrelevant data entry.

## Why this sprint next
The live form walkthrough showed that Eunice needs more than a generic admissions intake:

- the final page captures a separate fee-payer or debtor
- the form mixes parent, guardian, medical, academic, consent, and finance data
- conditional logic is weak, with some `No` answers still leaving follow-up fields visible
- document handling is central, not secondary
- several documents are only needed conditionally

The smarter approach is not to mirror the form page-for-page. It is to model the real intake roles and document rules once, then let the UI surface only what is relevant.

## Scope Completed
- Added the readiness-first parent flow.
- Added the live Eunice discovery notes.
- Aligned the staged workflow with the fuller live intake packet.
- Expanded the shared document contract to include the real document categories we confirmed.

## Sprint Plan

### P0: Canonical intake model
1. Define the canonical application data model for:
   - submitter
   - learner
   - parents or guardians
   - legal guardian
   - fee-payer or debtor
   - household context
   - medical profile
   - academic history
   - co-curricular profile
   - consents
2. Split fields that currently overlap between `parent`, `guardian`, and `fee-payer` concepts.
3. Make conditional documents explicit in the data model so non-applicable items can be hidden or marked `not applicable` without workaround text.

### P0: Document orchestration
1. Make the shared document contract the single source of truth for parent and admin surfaces.
2. Extend the upload guidance so each file type has a clear reason and status.
3. Add distinct handling for:
   - required documents
   - conditional documents
   - optional supporting documents
4. Add parent-friendly recovery for blocked or low-quality uploads.

### P0: Parent flow simplification
1. Keep the four-stage parent journey, but reduce duplication inside it.
2. Surface the fee-payer details only where they matter.
3. Hide irrelevant follow-up fields when a parent answers `No`.
4. Keep legal copy available, but avoid heavy warning blocks inside the main flow.

### P1: Admin triage alignment
1. Make the admin queue group applications by document readiness and review need.
2. Show separate markers for missing, review-only, and blocking documents.
3. Add a clear distinction between application status and document status.
4. Keep reviewer notes and re-upload requests in one place.

### P1: Smarter intake behavior
1. Add duplicate-upload detection by filename or hash.
2. Add a `clear / review / replace` quality placeholder per document.
3. Add OCR-readiness metadata without forcing full OCR implementation yet.
4. Add simple stage-dropoff tracking so we can see where parents struggle.

### P2: Delivery hardening
1. Keep the `src/` product app and `dev/` preview surface aligned.
2. Keep Supabase schema changes consistent with the canonical intake model.
3. Keep Vercel deployment assumptions explicit for preview versus product surfaces.
4. Keep Linear tasks tied to vertical slices rather than broad infrastructure work.

## Task Board

### Task 1: Canonical role model

**Goal**
Define the real admissions entities and remove role ambiguity from the current parent flow.

**Context**
The live Eunice intake form clearly separates submitter, fee-payer, and guardian responsibility in ways our current model does not. A single `parent` bucket is too vague for the product we are now building.

**Relevant files or references**
- [docs/DISCOVERY_REPORT_LIVE_FORM.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/DISCOVERY_REPORT_LIVE_FORM.md)
- [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)
- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md)

**Proposed approach**
- Define the canonical role fields and ownership boundaries.
- Separate contact identity from financial responsibility.
- Keep guardian fields optional and clearly conditional.

**Acceptance criteria**
- The application model distinguishes submitter, parent or guardian, legal guardian, and fee-payer.
- The role model can represent `N/A` or not-applicable contexts without fake values.
- The structure is clear enough for both parent UI and admin review UI.

**Verify**
- Review the model against the live form findings and current staged workflow.
- Confirm there is no duplicated role logic spread across `src/` and `dev/`.

**Out of scope**
- Full database migration implementation.
- Email templates.

### Task 2: Document contract and upload rules

**Goal**
Make the document vocabulary authoritative across parent upload and admin triage.

**Context**
The live intake requires a richer packet than the earlier MVP assumptions. Some documents are always required, others depend on citizenship, family context, employment context, or boarding context.

**Relevant files or references**
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)
- [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)
- [src/lib/documents/validation.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/validation.ts)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)

**Proposed approach**
- Keep one canonical document map for both surfaces.
- Distinguish required, conditional, and optional supporting documents.
- Make the reasoning for each document visible to parents.

**Acceptance criteria**
- Required and conditional documents are clearly defined in one place.
- Admin and parent surfaces use the same labels and status meanings.
- The contract can support permit and custody documents without hacks.

**Verify**
- Cross-check the contract against the live Eunice document list.
- Confirm non-South African and divorce or custody cases are represented cleanly.

**Out of scope**
- OCR engine implementation.
- Advanced duplicate detection.

### Task 3: Parent flow simplification

**Goal**
Make the parent journey shorter, clearer, and less repetitive while still capturing the real intake details.

**Context**
The right answer is not a page-for-page clone of the Google Form. Parents should see only the fields that matter to their situation, and irrelevant branches should disappear cleanly.

**Relevant files or references**
- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx)
- [docs/DISCOVERY_REPORT_LIVE_FORM.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/DISCOVERY_REPORT_LIVE_FORM.md)

**Proposed approach**
- Keep the four-stage flow.
- Hide irrelevant questions when answers make them unnecessary.
- Group legal and financial detail only where it is needed.
- Avoid repeating document guidance in multiple places.

**Acceptance criteria**
- A parent can complete the flow without seeing irrelevant required fields.
- Fee-payer details appear clearly and only when needed.
- The flow feels lighter than the live form while still covering the real intake.

**Verify**
- Walk the flow with the live Eunice intake scenarios we observed.
- Confirm the `No` branches no longer leave junk required fields behind.

**Out of scope**
- Backend persistence redesign.
- Final visual redesign.

### Task 4: Admin triage alignment

**Goal**
Let admins review the same intake structure without mentally translating between document states and application states.

**Context**
The live process creates a lot of document and compliance noise. The admin surface should collapse that noise into clear readiness, review, and blocker groups.

**Relevant files or references**
- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md)

**Proposed approach**
- Group applications by missing documents, review-only documents, and ready-for-review status.
- Keep reviewer notes near the document list.
- Make it easy to request a re-upload without changing the application meaning.

**Acceptance criteria**
- The queue clearly distinguishes blocked, review-ready, and in-review applications.
- Document and application state are not conflated.
- The reviewer can tell what the next action should be at a glance.

**Verify**
- Review the queue against the live Eunice document rules.
- Confirm the admin surface uses the same document vocabulary as the parent flow.

**Out of scope**
- OCR processing runtime.
- Communication automation.

### Task 5: Smarter intake signals

**Goal**
Add low-cost intelligence that reduces parent mistakes and admin follow-up before we reach heavy automation.

**Context**
The forms taught us where parents get stuck. We should add the cheapest useful intelligence first, before full OCR or complex processing.

**Relevant files or references**
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md)
- [src/lib/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts)

**Proposed approach**
- Add duplicate detection by filename or hash.
- Add quality placeholders such as `clear`, `review`, and `replace`.
- Add OCR-readiness metadata without making OCR a blocking dependency.
- Add stage drop-off tracking for the parent flow.

**Acceptance criteria**
- Duplicate uploads are surfaced to the user or admin instead of silently accepted.
- Low-quality documents are routed into a review or re-upload path.
- The product records where parents abandon the flow.

**Verify**
- Confirm the signals do not add friction to successful parents.
- Confirm the new metadata can exist without a full OCR service yet.

**Out of scope**
- Real OCR accuracy tuning.
- Full analytics dashboard.

## Definition of Done
- The application model separates the real roles we observed.
- The document contract covers the live Eunice packet and conditional cases.
- The parent flow hides irrelevant branches cleanly.
- The admin queue and detail views understand the same document states.
- We have a cheap-intelligence layer for duplicates, quality placeholders, and drop-off signals.
- The sprint remains small enough to ship as vertical slices.

## Closeout
- The branch preview is live on Vercel.
- The current PR is the working GitHub surface for this sprint.
- Linear should now treat this sprint as complete and move focus to the next phase.

## Next Phase: Product Feel + Trust Layer
The platform is now structurally smart enough. The next phase makes it feel like a real admissions product.

### Focus areas
1. Visual hierarchy: typography, spacing, card rhythm, and clearer page structure.
2. Trust cues: admissions progress, friendly guidance, stronger empty states, and clearer next steps.
3. Parent experience polish: better upload states, review summaries, confirmation surfaces, and stage context.
4. Admin dashboard polish: queue density, operational status, summary blocks, and action clarity.
5. Brand treatment: Eunice-specific color, tone, and polish so the platform feels intentional, not generic.

### Phase B outcomes
- A warmer, more finished-looking parent portal.
- An admin dashboard that feels operational.
- A coherent visual system across both surfaces.
- A platform that looks like a real product, not a scaffold.
