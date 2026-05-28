# Sprint AA - Document Intelligence Lite

**Status:** Complete

## Sprint Goal

Make uploaded documents easier to trust and easier to review by adding lightweight quality guidance and simple validation cues without building a heavy AI pipeline.

## Why This Sprint Matters

The document layer is where parent friction and staff fatigue meet. A light quality gate improves both sides: parents know what to fix before they upload, and staff get fewer noisy files in the queue.

## P0 - Quality Guidance For Uploads

### Goal

Help parents understand when a file is clear enough, and when it needs another attempt.

### Focus

- blur guidance
- orientation guidance
- partial-capture guidance
- unsupported file detection hints

### Acceptance Criteria

- Parents can tell how to improve a bad upload before staff intervene.
- The UI still feels calm and lightweight.

## P1 - Lightweight Confidence And Duplicate Cues

### Goal

Add simple document intelligence that improves review speed without expensive infrastructure.

### Focus

- confidence/readability scoring
- duplicate-style upload hints
- OCR-ready metadata shape
- useful review labels, not noisy warnings

### Acceptance Criteria

- The queue shows which files are low confidence at a glance.
- Duplicate or repeated uploads are easier to spot.

## P2 - Browser Review And Tightening

### Goal

Check the new cues in browser and trim anything that feels too technical or verbose.

### Focus

- verify parent upload cues
- verify admin queue cues
- keep the interface visually calm

### Acceptance Criteria

- The document layer feels helpful rather than punitive.
- The new cues reduce confusion instead of adding noise.

## Source Reference

- [docs/SPRINT_R_DOCUMENT_INTAKE_INTELLIGENCE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_R_DOCUMENT_INTAKE_INTELLIGENCE.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Verify

- Visual review of the document upload surfaces in `/dev`
- `cd dev && npm run check`

## First Pass Plan

1. Add calm parent-facing quality cards for blurry, partial, and orientation issues.
2. Expose a compact confidence cue in admin queue rows and selected-application context.
3. Keep the copy action-oriented and short; avoid technical jargon.
4. Run `src` and `dev` checks, then deploy `/dev` and browser-review parent and admin routes.

## First Pass Delivered

- Added clearer upload-quality guidance in the parent workflow for blurry, low-confidence, manual-review, and format/size issues.
- Added compact confidence chips in admin queue rows so reviewers can triage quality at a glance.
- Extended lightweight validation heuristics to catch orientation and partial-capture naming cues while staying in the existing low-cost signal model.
- Verification passed:
  - `npm run verify:src`
  - `cd dev && npm run check`

## Sprint Outcome

- Parent uploads now provide clearer fix guidance for blur, orientation risk, and partial-capture risk.
- Admin queue rows now surface upload confidence directly, reducing reviewer scan time.
- Document-quality signaling stayed lightweight and low-cost, with no added heavy pipeline dependencies.
