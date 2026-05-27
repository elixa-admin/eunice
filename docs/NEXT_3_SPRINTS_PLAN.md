# Next 3 Sprints Plan

**Status:** Active

## Planning Intent

Keep Eunice moving toward a lightweight admissions operating system by sequencing the next three sprints around parent calm, admin decisiveness, and the lightest useful automation layer.

## Shared Direction

- `dev/` remains the active preview and product-shaping lane.
- Parent surfaces should stay calm, guided, and sparse.
- Admin surfaces should become more queue-driven, decision-oriented, and operationally clear.
- Every screen should answer: `What is the next action?`
- Prefer low-cost, low-complexity implementation paths.
- Prepare for `n8n`, `Tesseract OCR`, and multi-school support without overbuilding them now.

## Sprint S — Parent Capture and Calm Upload Flow

**Status:** Implemented

**Goal**

Reduce parent-side friction by making capture, consent, and upload feel calmer and more guided on mobile.

**Focus**

- POPIA consent gating
- clearer upload guidance
- client-side WebP compression before upload
- mobile capture assistance
- document accordion grouping:
  - Always Required
  - Conditional
  - Supporting

**Primary doc**

- [docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)

## Sprint T — Admin Decision Acceleration

**Status:** Implemented

**Goal**

Make the admin workspace faster to scan and easier to act on by increasing decision density while reducing visual clutter.

**Focus**

- stronger issue-first queue hierarchy
- speed triage mode for bulk review
- role-based document compartmentalization
- zone / context tags for early routing
- tighter evidence and outcome framing

**Primary doc**

- [docs/SPRINT_P_ADMIN_DECISION_ENGINE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_P_ADMIN_DECISION_ENGINE.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)

## Sprint U — Lightweight Automation and School Foundation

**Status:** Implemented

**Goal**

Make the core workflow operationally complete with lightweight automation hooks and a clean path toward later multi-school support.

**Focus**

- status-based notification wiring
- communication history and audit trail
- magic-link reupload completion path
- lightweight `n8n` readiness
- school configuration and template shape

**Primary doc**

- [docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Recommended Order

1. Sprint Z - Workflow Automation and Communication History
2. Sprint AA - Document Intelligence Lite
3. Sprint AB - Browser QA and Pattern Lockdown

## Sprint Y - Parent Upload Confidence and Admin Decision Speed

**Status:** In progress

**Goal**

Deliver the biggest UI/UX win for the least implementation churn by making the parent upload path feel unmistakably safe and guided, while making the admin queue faster to scan and act on.

**Focus**

- parent upload confidence and guidance
- upload quality feedback and visual reassurance
- admin decision speed and queue scanability
- keep parent and admin visibly distinct in intent

**Primary doc**

- [docs/SPRINT_Y_PARENT_UPLOAD_CONFIDENCE_AND_ADMIN_SPEED.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_Y_PARENT_UPLOAD_CONFIDENCE_AND_ADMIN_SPEED.md)

## Sprint Z - Workflow Automation and Communication History

**Status:** Planned

**Goal**

Reduce follow-up friction and make status transitions feel operationally complete.

**Focus**

- passwordless re-upload magic links
- lightweight `n8n` notification contracts
- communication history visibility in the admin timeline
- status-triggered message scaffolding

**Primary doc**

- [docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md)

## Sprint AA - Document Intelligence Lite

**Status:** Planned

**Goal**

Keep document quality checks lightweight, useful, and cheap to run so parents get clearer upload guidance and staff get fewer low-quality files in the queue.

**Focus**

- simple readability and quality cues for uploads
- blur, orientation, and partial-capture guidance
- duplicate-style upload detection hints
- confidence/readability scoring that stays lightweight

**Primary doc**

- [docs/SPRINT_AA_DOCUMENT_INTELLIGENCE_LITE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_AA_DOCUMENT_INTELLIGENCE_LITE.md)

## Sprint AB - Browser QA and Pattern Lockdown

**Status:** Planned

**Goal**

Verify the parent and admin changes in browser, then capture the winning visual patterns so we can reuse them without reopening theme debates.

**Focus**

- browser review of the updated latest preview
- confirm contrast and hierarchy in light surfaces
- lock reusable visual rules for parent and admin surfaces

**Primary doc**

- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Non-Goals For This Window

- heavy microservice decomposition
- enterprise workflow tooling
- expensive AI-first automation
- broad multi-school schema expansion before the single-school flow is crisp
