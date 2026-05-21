# Phase 2 Next 24 Hours Task Board

## Purpose

This is the smallest high-output slice for the next 24 hours. It keeps Eunice moving forward without reopening architecture every session.

## Working Order

1. Lock the document contract.
2. Wire the parent upload path to that contract.
3. Build the admin review slice around the same rules.

## Usage Gate

After each task, check the current usage against:

- the next 4 hours
- the 7-day limit

Then apply the project thresholds:

- Below `75%`: continue normally
- At or above `75%`: prioritize critical-path work, docs, and publishable checkpoints
- At or above `85%`: shorten the next sprint and begin wrap-up mode

## Task 1: Lock the Document Contract

**Goal**

Make document validation, document states, and storage rules authoritative in one place.

**Context**

Document handling is the biggest operational pain point for Eunice. We already know the MVP needs hard validation, soft review states, and room for OCR later. The contract should work for both `src/` and `dev/`.

**Relevant files or references**

- [src/lib/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts:1)
- [src/lib/documents/validation.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/validation.ts:1)
- [src/lib/documents/storage.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/storage.ts:1)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [docs/PHASE_2_DELIVERY_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PHASE_2_DELIVERY_PLAN.md:1)

**Proposed approach**

- Confirm the allowed file types and size rules.
- Make the document-processing states explicit: valid, wrong format, too large, blurry/unreadable, manual review, and re-upload required.
- Keep the validation helpers and status labels shared rather than duplicated.

**Acceptance criteria**

- One canonical document contract exists for the product and preview surfaces.
- Hard-stop failures and soft-review failures are clearly separated.
- The contract can support later OCR or verification work without a rewrite.

**Verify**

- Review the contract for completeness against the current Eunice requirements.
- Confirm the contract does not rely on duplicate rules in route files or preview data.

**Out of scope**

- Real OCR implementation.
- File upload persistence wiring.
- Admin UI changes beyond contract-aware copy or states.

## Task 2: Wire the Parent Upload Path

**Goal**

Make the parent flow respect the document contract and show clear, parent-friendly feedback when uploads fail or need review.

**Context**

The parent journey already exists, but the document step still needs to behave like a real admissions workflow rather than a mock preview. This slice should keep the flow draft-safe and non-technical.

**Relevant files or references**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx:1)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx:1)
- [src/lib/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts:1)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)

**Proposed approach**

- Connect upload validation messages to the shared document contract.
- Show plain-language guidance for wrong-format and unreadable documents.
- Keep the parent experience recoverable without losing progress.

**Acceptance criteria**

- The parent flow explains upload problems in plain language.
- The flow distinguishes between “cannot continue yet” and “continue later with a warning.”
- The upload path stays aligned with the shared document rules.

**Verify**

- Walk through the parent flow and confirm blocked uploads and soft warnings are understandable.
- Confirm the flow still supports draft-safe progress.

**Out of scope**

- Backend upload persistence.
- OCR processing.
- Email notifications.

## Task 3: Build the Admin Review Slice

**Goal**

Turn the admin side into a credible queue for document review, triage, and application progress.

**Context**

Eunice’s admin burden is driven by missing documents, unreadable documents, and manual follow-up. The admin slice should expose document states, reviewer notes, and re-upload decisions using the same rules as the parent flow.

**Relevant files or references**

- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx:1)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx:1)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx:1)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)

**Proposed approach**

- Reflect document states in the queue and application detail views.
- Surface missing items, re-upload flags, and reviewer notes clearly.
- Keep admins as the final human decision-maker.

**Acceptance criteria**

- The admin queue can show which applications are blocked, review-ready, or needing re-upload.
- Reviewer notes and document states are visible in one place.
- The review slice uses the same document vocabulary as the parent flow.

**Verify**

- Review the admin queue and detail surfaces for clear blocked/review/ready distinctions.
- Confirm the slice does not introduce a second document vocabulary.

**Out of scope**

- OCR engine integration.
- Communication automation.
- Schema changes beyond what the document contract already supports.

## Exit Check

At the end of the 24 hours, we should be able to say:

- the document contract is stable,
- the parent flow speaks that contract clearly,
- the admin review surface uses the same language,
- and any newly discovered duplication has been removed rather than copied forward.

If usage is at or above `75%`, the exit check also includes:

- durable docs are current,
- the slice is commit-ready or handoff-ready,
- and the next sprint has been narrowed rather than expanded.
