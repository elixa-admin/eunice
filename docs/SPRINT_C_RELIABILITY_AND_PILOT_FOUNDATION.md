# Sprint C: Reliability and Pilot Foundation

## Status
Active

## Sprint Window
- Start: 2026-05-24
- Target end: 2026-06-02

## Sprint Goal
Make the admissions platform dependable under real intake pressure while preparing a clean path into pilot operations.

## Success Outcomes
- Parent flow remains usable on low-end mobile and unstable connectivity.
- Admin triage is fast and explicit about next action.
- Upload and document handling is trustworthy and recoverable.
- Pilot support rituals and KPI cadence are ready before rollout.

## Workstreams

### 1) Reliability Hardening (P0)
- Add a compact regression pack for critical journeys:
  - parent auth, draft, upload, submit
  - admin queue, detail, status update
- Tighten error handling and recovery for auth/session drift, draft save/load, and upload failures.
- Run a performance pass for mobile viewport and constrained network assumptions.

### 2) Intake Quality Controls (P0)
- Standardize document quality states across surfaces: `clear`, `review`, `replace`.
- Add duplicate-upload detection signal and parent-friendly resolution guidance.
- Enforce conditional document logic so non-applicable requirements do not block completion.

### 3) Admin Throughput (P1)
- Align queue buckets to actionable states: `blocked`, `review_ready`, `in_review`.
- Add high-value filters: missing documents, recently submitted, awaiting parent action.
- Keep reviewer notes and re-upload requests in one coherent review loop.

### 4) Pilot Operations Foundation (P1)
- Publish support playbook for incident triage and response expectations.
- Define KPI baseline and cadence:
  - completion rate
  - stage drop-off
  - re-upload rate
  - review turnaround
- Add a daily pilot checkpoint template.

## Execution Cadence
- Daily standup frame:
  - What blocks parent completion?
  - What blocks admin decisions?
  - What can fail silently today?
- Midday verification pass on touched critical flows.
- End-of-day checkpoint update with evidence and carry-over risks.

## Exit Criteria (Definition of Done)
- Critical parent/admin journeys pass the regression pack.
- Upload and document failure paths are recoverable without manual engineering intervention.
- Admin can identify next action on an application in under 10 seconds.
- Support playbook and KPI cadence docs are present and actionable.

## Out of Scope
- OCR implementation depth work.
- Advanced analytics dashboards.
- Major visual redesign unrelated to reliability or throughput.
- New feature families outside admissions MVP core.

## First 24-Hour Push
1. Lock regression checklist and run baseline.
2. Close top three parent flow recovery gaps.
3. Align admin queue grouping and missing-doc filter behavior.
4. Publish first Sprint C checkpoint with pass/fail evidence.
