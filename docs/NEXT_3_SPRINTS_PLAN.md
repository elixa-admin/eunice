# Next 3 Sprints Plan

**Status:** Active

## Planning Intent

Keep Eunice moving toward a lightweight admissions operating system by sequencing the next three sprints around clarity first, then workflow support, then practical document intelligence.

## Shared Direction

- `dev/` remains the active preview and product-shaping lane.
- Parent surfaces should stay calm, guided, and sparse.
- Admin surfaces should become more queue-driven, decision-oriented, and operationally clear.
- Every screen should answer: `What is the next action?`
- Prefer low-cost, low-complexity implementation paths.
- Prepare for `n8n`, `Tesseract OCR`, and multi-school support without overbuilding them now.

## Sprint P — Admin Decision Engine

**Status:** In progress

**Goal**

Turn the `/dev` admin workspace into a clearer decision workbench.

**Focus**

- selected-applicant anchor
- issue-first queue rows
- grouped evidence by state
- less equal-weight card clutter
- detail page alignment

**Primary doc**

- [docs/SPRINT_P_ADMIN_DECISION_ENGINE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_P_ADMIN_DECISION_ENGINE.md)

## Sprint Q — Workflow Automation and Communication Trail

**Status:** Complete

**Goal**

Add the lightest useful operational workflow support so communication and follow-up become visible and structured.

**Focus**

- communication history in admin
- status-to-notification mapping
- magic-link reupload scaffolding
- later compatibility with `n8n`

**Primary doc**

- [docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md)

## Sprint R — Document Intake Intelligence

**Status:** Complete

**Goal**

Improve document quality and reviewer confidence with the lightest useful validation layer.

**Focus**

- upload quality guidance
- readability and confidence signals
- duplicate detection heuristics
- OCR-first extraction direction, starting from `Tesseract OCR`
- calmer parent feedback when a document needs replacement

**Expected shape**

- start with UI contracts and local validation heuristics
- avoid expensive AI pipelines
- keep storage and workflow impact transparent to staff

## Recommended Order

1. Review the deployed Sprint Q preview and confirm the communication trail feels useful.
2. Review the Sprint R document-intake cues in the preview and confirm the shape feels lightweight.
3. Move into the next sprint only after the document-intake path feels calm and readable.

## Non-Goals For This Window

- heavy microservice decomposition
- enterprise workflow tooling
- expensive AI-first automation
- broad multi-school schema expansion before the single-school flow is crisp
