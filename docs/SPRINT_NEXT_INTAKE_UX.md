# Sprint: Intake UX Compression + Quality Guardrails

## Objective
Deliver a shorter, more intuitive admissions journey with clear upfront requirements, stronger upload validation, and fewer submission surprises.

## Scope Completed (This Slice)
- Added a mandatory readiness gate before data capture starts.
- Reframed the flow into four clear stages:
  - Readiness and eligibility
  - Parent and learner profile
  - Document uploads
  - Review and submit
- Added upfront checklist and file quality guidance.
- Added review-stage pre-submit checklist with hard readiness checks.
- Aligned the staged flow with the live Eunice form packet, including fee-payer identity and the fuller school document set.

## Next Sprint Task Board

### P0 (Immediate)
1. Centralize dynamic document requirements for parent and admin workflows.
2. Integrate conditional field logic to remove irrelevant required fields.
3. Upgrade final review with dynamic blockers and action prompts.
4. Add admin triage grouping for missing documents and review-ready cases.

### P1 (High Value)
1. Add duplicate-upload detection by filename/hash and show parent-friendly remediation.
2. Add upload quality scoring placeholder per document (`clear`, `review`, `replace`).
3. Add OCR/readability pipeline contract (OpenCV + Tesseract) and map results to validation states.

### P2 (Stability + Insight)
1. Add drop-off instrumentation by stage and document type.
2. Add admissions triage status mapping (`accepted`, `needs_reupload`, `manual_review`).
3. Add reminder trigger payload model for missing/failed documents.

## Definition of Done (Next Sprint)
- No irrelevant required field blocks when parent answers "No."
- Every document receives an explicit quality/result status before submit.
- Parent can complete full flow in 4 stages with clear completion guidance.
- Review stage blocks only on true blockers and explains exactly what to fix.
