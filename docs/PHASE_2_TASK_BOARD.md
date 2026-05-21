# Phase 2 Task Board

## Purpose

This task board turns the Phase 2 delivery plan into execution-ready work for the first two sprints. It is intentionally grounded in the current Eunice repo shape:

- `src/` contains the emerging real app surface
- `dev/` contains the product preview and workflow exploration surface
- `supabase/` is linked but does not yet contain the real migration set for the MVP

The aim is to get us from architecture and preview work into real MVP implementation without losing the flexibility needed as more Eunice workflow detail arrives.

## Sprint 1: Product Foundation and Workflow Skeleton

### Goal

Create the minimum real foundation for the MVP so the parent application flow can be built on stable models, statuses, storage rules, and backend boundaries.

### Task 1.1: Canonical Application State Model

Goal

Define the real MVP application states and transitions for Eunice.

Context

The current repo and docs still mix older generic statuses with newer preview assumptions. We now have enough signal to define a cleaner MVP state model that supports missing docs, review, and decisions.

Relevant files or references

- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- [docs/PHASE_2_DELIVERY_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PHASE_2_DELIVERY_PLAN.md:1)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)

Proposed approach

- Define canonical application statuses and their meaning.
- Distinguish application status from document status.
- Document allowed transitions and which ones trigger communication events.

Acceptance criteria

- One canonical list of application states exists in docs and code-ready form.
- The model supports draft, submission, incomplete/missing-doc handling, review, and final decisions.
- Statuses are understandable by both parents and admins.

Verify

- Review the model and confirm it covers the current Eunice workflow signals.
- Confirm document-specific problems do not require inventing duplicate application statuses unnecessarily.

### Task 1.2: Schema Draft and Migration Baseline

Goal

Create the first real MVP schema and migration outline for applications, profiles, documents, communications, and notes.

Context

The current app reads from Supabase concepts like `profiles` and `applications`, but the repo does not yet have a proper migration set checked in.

Relevant files or references

- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx:1)

Proposed approach

- Create a first migration draft for:
  - profiles
  - applications
  - documents
  - communications
  - admin_notes
- Include school-aware keys and storage path assumptions.
- Make room for document-processing metadata from the integration spec.

Acceptance criteria

- The repo contains a real migration baseline under `supabase/migrations/`.
- Core entities and relationships are explicit.
- The schema is compatible with current parent/admin use cases and future document processing.

Verify

- Review SQL and confirm it supports both parent and admin workflows in the requirements.
- Confirm document metadata fields can absorb validation and OCR states later without a rewrite.

### Task 1.3: Storage and Document Contract

Goal

Define the initial document contract used by uploads, storage, and admin review.

Context

Document handling is central to Eunice’s operational pain, so the MVP must establish a stable document contract before the upload flow is fully built.

Relevant files or references

- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [docs/PHASE_2_DELIVERY_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PHASE_2_DELIVERY_PLAN.md:1)

Proposed approach

- Define required document categories for MVP.
- Define storage path rules.
- Define document metadata and validation states.
- Add code-level constants/types for these rules in the app layer.

Acceptance criteria

- There is one authoritative set of document categories and validation states.
- The contract is suitable for both the real `src/` app and the `dev/` preview surface.

Verify

- Confirm the contract covers required uploads from the functional requirements.
- Confirm it aligns with the planned processing states.

### Task 1.4: Backend Structure Skeleton

Goal

Lay down the code structure for document validation, storage helpers, and future integrations without yet implementing the full feature set.

Context

We need a place for the real backend logic to live before Sprint 2 begins the parent application flow.

Relevant files or references

- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [src/app/api/ping/route.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/api/ping/route.ts:1)

Proposed approach

- Add initial module scaffolding for:
  - application status types
  - document validation rules
  - storage path helpers
  - integration adapter interfaces

Acceptance criteria

- The repo has clear folders/modules for the MVP foundation logic.
- Later API routes can use these modules instead of duplicating rules.

Verify

- Review structure and confirm it maps cleanly to the integration spec.

## Sprint 2: Parent Application Flow MVP

### Goal

Deliver the first real parent experience from account creation through draft application and submission flow.

### Task 2.1: Parent Authentication Path

Goal

Stabilize signup and signin so parents can reliably enter the admissions process.

Context

Auth screens already exist in `src/app/auth/`, but they need to align with the real Phase 2 workflow and data model.

Relevant files or references

- [src/app/auth/signup/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signup/page.tsx:1)
- [src/app/auth/signin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signin/page.tsx:1)

Proposed approach

- Confirm parent account assumptions.
- Align profile creation and redirect behavior with the new schema baseline.
- Keep the UX mobile-first and low-friction.

Acceptance criteria

- Parents can create accounts and sign in successfully.
- Parent profiles are created or retrieved consistently.
- Redirect behavior supports the admissions flow.

Verify

- Manual auth flow test from signup to parent landing page.

### Task 2.2: Multi-Step Application Skeleton

Goal

Build the real parent application structure with draft-safe steps and required fields.

Context

The application flow must reflect Eunice’s real information needs, not a generic school form.

Relevant files or references

- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- Eunice Phase 1 assessment outcome

Proposed approach

- Implement a multi-step form structure:
  - parent/guardian
  - learner
  - school and admissions context
  - documents
  - review
- Include clear draft/save assumptions even if persistence is completed in a follow-on slice.

Acceptance criteria

- Parent can move through the full flow.
- Required Eunice-specific fields are represented.
- The structure is ready for document upload integration.

Verify

- Manual walk-through of the multi-step flow on mobile and desktop viewport sizes.

### Task 2.3: Review and Submission Baseline

Goal

Allow parents to review captured information and submit a complete application safely.

Context

Submission is the first real lifecycle transition and must connect cleanly to status, communications, and admin queue behavior.

Relevant files or references

- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- [docs/PHASE_2_DELIVERY_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PHASE_2_DELIVERY_PLAN.md:1)

Proposed approach

- Add review screen
- add submission checks
- set initial submitted status
- capture submission timestamp and reference number

Acceptance criteria

- A complete draft can become a submitted application.
- Submission metadata is recorded consistently.
- The resulting application is ready for admin review workflow.

Verify

- Manual test from draft to submitted state.

## Recommended Execution Order

1. Task 1.1
2. Task 1.2
3. Task 1.3
4. Task 1.4
5. Task 2.1
6. Task 2.2
7. Task 2.3

## Recommended Immediate Execution Slice

The best immediate next slice is:

- Task 1.1: Canonical Application State Model
- Task 1.2: Schema Draft and Migration Baseline
- Task 1.3: Storage and Document Contract

This gives the app a real foundation and avoids building the parent flow on moving assumptions.
