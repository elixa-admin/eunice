# Phase 2 Delivery Plan

## Purpose

This document reframes Phase 2 as an execution plan for the Eunice MVP based on:

- the existing Phase 2 goals in [PHASES.md](./PHASES.md)
- the functional scope in [REQUIREMENTS.md](./REQUIREMENTS.md)
- the architecture baseline in [ARCHITECTURE.md](./ARCHITECTURE.md)
- the new integration and document-processing spec in [integrations-and-document-processing/spec.md](./integrations-and-document-processing/spec.md)
- the first assessment signals received from Eunice Primary School

The goal is to sequence Phase 2 work so that we deliver the highest operational value first, while keeping the architecture open for additional workflows, systems, and data stores as more discovery input arrives.

## Current Read

The strongest signals so far are:

- Eunice processes high admissions volume relative to manual capacity.
- The current workflow depends on Google Forms, Google Sheets, and Google Drive.
- The biggest operational pain is document-related:
  - missing documents
  - blurry or unreadable uploads
  - incomplete applications
  - duplicate submissions
  - late submissions
- The biggest value levers are:
  - reducing admin work
  - document management
  - automated reminders
  - communication with parents
  - application tracking
  - speed and record keeping

This means Phase 2 should not begin with "generic app scaffolding" alone. It should prioritize the parts of the product that reduce operational friction fastest.

## Phase 2 Objectives

1. Deliver a working MVP parent admissions flow.
2. Deliver a usable admin review workflow.
3. Build the document workflow as a first-class system, not a side feature.
4. Establish safe integration boundaries for future systems and data stores.
5. Keep the implementation simple enough for MVP while avoiding dead-end architecture.

## Phase 2 Exit Criteria

Phase 2 is complete when:

- a parent can create and submit an application
- required documents can be uploaded with validation
- admins can review, flag, and progress applications
- missing or low-quality documents can be identified and handled
- email-based reminders and status communication work
- core auditability and storage conventions are in place
- the app is deployable and stable enough for pilot preparation

## Delivery Principles

- Build vertical slices, not disconnected layers.
- Prioritize document workflow because it is Eunice's biggest operational bottleneck.
- Keep admin users as the final decision-maker for admissions and document verification.
- Use managed services where already chosen: Supabase, Vercel, Resend.
- Prefer free/open-source tooling for OCR and document quality support.
- Preserve flexibility for later additions of external systems or extra school workflows.

## Phase 2 Workstreams

### 1. Core Platform Foundation

Scope:

- Next.js app structure
- Supabase project wiring
- schema and migrations
- auth roles
- storage pathing
- environment setup
- deployment pipeline

Why it matters:

Everything else depends on this, but it should be built only to the level needed to support the first real admissions flows.

### 2. Parent Admissions Flow

Scope:

- signup and login
- guided multi-step application
- save-and-return draft workflow
- document checklist and uploads
- review and submit
- status tracking

Why it matters:

This is the front door for all admissions intake and must be simple, mobile-friendly, and resilient.

### 3. Admin Operations Workflow

Scope:

- admissions queue
- application detail review
- document review states
- status management
- internal notes
- reminder triggers

Why it matters:

This is where the biggest time savings will be realized for Eunice staff.

### 4. Document Processing and Validation

Scope:

- upload validation
- storage metadata
- processing states
- re-upload workflow
- quality/blur detection preparation
- OCR integration preparation

Why it matters:

This is the highest-value operational workstream because document problems currently drive follow-up, delays, and admin effort.

### 5. Communication and Audit Trail

Scope:

- acknowledgement emails
- missing document reminders
- status update emails
- decision notifications
- communication history
- action and timestamp tracking

Why it matters:

Manual follow-up is one of the current pain points. This workstream directly reduces repetitive communication effort.

### 6. Integration Boundary and Future Extensibility

Scope:

- storage adapter boundary
- email adapter boundary
- future messaging hooks
- future SIS/ERP hooks
- integration configuration model

Why it matters:

More applications or data stores may be introduced later. This workstream prevents the MVP from becoming brittle.

## Recommended Sprint Sequence

### Sprint 1: Product Foundation and Workflow Skeleton

Focus:

- finalize app structure
- establish auth roles and base schema
- scaffold applications, documents, communications, and notes models
- keep the current `dev/` preview aligned with intended real screens

Deliverables:

- foundation schema and migration outline
- app route skeletons
- role model
- base reference number approach
- storage hierarchy conventions

Value return:

- unblocks all later work
- reduces architectural churn

### Sprint 2: Parent Application Flow MVP

Focus:

- parent signup/login
- multi-step admissions form
- save-and-return draft flow
- review and final submit

Deliverables:

- working parent journey from account creation to submitted application
- draft state handling
- required data capture for the current Eunice model

Value return:

- creates the first real end-to-end application path
- gives a testable base for document and admin flows

### Sprint 3: Upload Validation Foundation and Admin Review Basics

Focus:

- document upload validation
- accepted formats and file-size rules
- deterministic storage paths
- admin queue and application detail
- baseline document states

Deliverables:

- authoritative document validation rules
- admin queue with filterable applications
- application detail with document checklist and review context

Value return:

- directly attacks Eunice's biggest pain area
- creates the first meaningful admin workflow

### Sprint 4: Document Review Workflow and Parent Re-Upload Handling

Focus:

- missing-document flags
- blurry/unclear document handling
- re-upload-required parent states
- admin review notes and override decisions

Deliverables:

- clear distinction between valid, blocked, and review-required documents
- parent guidance for recovery
- admin review actions that reduce ambiguity

Value return:

- improves completion rate
- reduces manual back-and-forth

### Sprint 5: Communications and Operational Automation

Focus:

- submission acknowledgement
- missing document reminders
- status-based notifications
- communication log
- initial reminder trigger logic

Deliverables:

- production-ready email templates
- communication events linked to application lifecycle
- reminder workflow for incomplete applications

Value return:

- reduces repetitive staff outreach
- improves parent visibility and response time

### Sprint 6: OCR and Integration Readiness

Focus:

- OCR/quality adapter skeleton
- document-processing job model
- integration registry baseline
- future data-store boundary

Deliverables:

- code-level contract for OCR, quality checks, and future integrations
- structured processing result model
- future-safe adapter pattern

Value return:

- keeps MVP extensible without overbuilding
- sets up a clean path for future automation

## High-Value Return Order

If capacity is tight, prioritize in this order:

1. Parent application flow
2. Admin queue and review
3. Document validation
4. Missing-document and re-upload handling
5. Communications automation
6. OCR and advanced integration work

This order is based on immediate operational return for Eunice, not technical elegance.

## Deferred Until Workflow Is Better Understood

- advanced OCR-driven verification
- automatic document classification
- WhatsApp or SMS messaging
- school ERP / SIS integrations
- analytics dashboards beyond MVP reporting
- multi-school tenancy implementation
- dynamic workflow builder/configuration UI

## Risks and Mitigations

### Risk: Workflow still evolving

Mitigation:

- keep workflow states configurable where reasonable
- avoid overfitting to a single assumption too early
- use the `dev/` preview surface to test workflow decisions before hard implementation

### Risk: Document logic becomes too complex too early

Mitigation:

- keep admin review as final authority
- treat OCR and quality checks as assistive first
- implement hard validation before advanced automation

### Risk: Architecture becomes brittle as more systems are introduced

Mitigation:

- introduce adapter boundaries early
- separate application logic from processing logic
- separate feature code from third-party integration code

## Recommended Immediate Next Steps

1. Continue the `dev/` preview toward Sprint 3-level realism:
   - upload states
   - admin document review states
   - parent re-upload guidance
2. Define the first real application and document schema draft.
3. Implement the upload validation foundation before full backend document automation.
4. Prepare the communications model in parallel so reminder and status workflows slot in cleanly.

## Planning Note

This plan assumes Phase 2 can proceed while discovery continues to sharpen edge cases. As more Eunice assessment material arrives, this plan should be updated, especially around:

- application states
- document requirements by grade
- family and sibling logic
- cut-off or timing rules
- any additional systems or data sources Eunice uses operationally
