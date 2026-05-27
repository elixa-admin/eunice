# Sprint R — Document Intake Intelligence

**Status:** In progress

## Sprint Goal

Improve document intake quality without making the system heavy. The aim is to help parents upload clearer files and to give staff better signals about which uploads are usable, questionable, or likely duplicated.

This sprint should stay lightweight: first improve the feedback and validation shape, then only add OCR or automated intelligence where it clearly reduces review effort.

## Design Direction

- Keep the parent flow calm and mobile-friendly.
- Make upload guidance specific, short, and useful.
- Surface quality cues before the file becomes a review burden.
- Keep OCR and duplicate detection incremental rather than elaborate.
- Preserve the premium academic visual language while making the document path more practical.

## Scope

### In scope

- clearer upload feedback for blurry, low-confidence, and duplicate files
- document-quality cues in the parent workflow
- preview-friendly validation states that can later support OCR
- lightweight review signals for staff
- docs and planning updates

### Out of scope

- heavy AI scoring pipelines
- broad backend schema changes
- enterprise workflow orchestration
- full OCR production rollout

## P0 — Upload Quality Guidance

**Goal**

Help parents understand when an upload is likely too blurry, too dark, duplicated, or otherwise hard to review.

**Relevant files**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [src/lib/parent-application.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/parent-application.ts)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)

**Proposed approach**

- Surface clearer guidance for poor uploads before or immediately after save.
- Keep the feedback short and reassuring.
- Distinguish usable uploads from ones that need another try.

## P1 — Lightweight Validation Signals

**Goal**

Add document-quality states that can support later OCR and review automation without requiring them now.

**Relevant files**

- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)

**Proposed approach**

- Keep validation states explicit and human-readable.
- Prepare for blur, duplicate, and low-confidence cues without building a heavy analyzer yet.
- Make preview data reflect the states we want to support.

## P2 — OCR-Ready Shape

**Goal**

Prepare the document flow so OCR can be added later without rewiring the upload experience.

**Relevant files**

- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

**Proposed approach**

- Keep the upload contract open for OCR metadata later.
- Avoid committing to a heavy extraction pipeline yet.
- Make the system ready for `Tesseract OCR` or a similar lightweight option when the need is clear.

## Success Definition

Sprint R is successful if:

1. Parents get clearer guidance on when an upload needs another attempt.
2. Staff can distinguish usable documents from weak ones more easily.
3. The document contract is ready for later OCR without a redesign.
4. The implementation stays lightweight and easy to maintain.

## Current Progress

- P0 upload-quality guidance has been added to the parent workflow.
- The preview lane now shows `blurry`, `low_confidence_ocr`, and manual-review-style repeat uploads so the states are visible in-browser.
- The `src` route health issue on `/app/dev/admin` has been cleaned up so the verifier passes again.
- The sprint is still intentionally lightweight; no heavy OCR or AI pipeline has been introduced yet.

## Verify

- `npm run verify:src`
- `npm run verify:dev`
- Manual parent upload review on the `/dev` preview
