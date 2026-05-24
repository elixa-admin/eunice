# Sprint D: UX Elevation and Production Hardening

## Status
Planned

## Sprint Window
- Start: 2026-06-03
- Target end: 2026-06-14

## Sprint Goal
Elevate parent and admin experience quality while hardening production safety controls for pilot readiness.

## Why This Sprint
Sprint C established reliability and pilot foundations. Sprint D converts that foundation into faster workflows, clearer feedback loops, and stronger trust signals using proven patterns from official Next.js, Supabase, shadcn, and Vercel guidance.

## Scope
- In scope: form UX robustness, admin triage usability, authorization hardening, observability instrumentation, and upload recovery clarity.
- Out of scope: OCR features, multi-school tenancy implementation depth, WhatsApp integration, and broad visual redesign.

## Workstreams and Priorities

### 1) Parent Form UX Hardening (P0)
Migrate critical submit/update paths to robust action-driven patterns with explicit pending, validation, and recovery states.

#### Tasks
1. Add consistent pending states and disabled submit guards for auth/signup and application submit actions.
2. Standardize validation errors into user-readable field and form-level messages.
3. Add optimistic UI feedback for save-to-draft and submit confirmation moments.
4. Ensure retry-safe behavior for network interruptions (no duplicate submissions).

#### Acceptance Criteria
- Parent can always tell: "working", "saved", "failed", or "submitted".
- No double-submit created when submit is clicked repeatedly.
- Validation errors are actionable and mapped to fields.

### 2) Authorization and Data Safety Pass (P0)
Tighten data access boundaries using RLS-aligned behavior checks across parent/admin/principal roles.

#### Tasks
1. Review existing table access paths used by parent and admin surfaces.
2. Confirm RLS-enabled behavior for all exposed tables in MVP path.
3. Add policy verification checklist for read/write paths:
   - parent sees own applications only
   - admin sees school-scoped applications only
   - principal/superadmin role behavior is explicit
4. Add regression checks for unauthorized access attempts.

#### Acceptance Criteria
- Cross-user data cannot be read or mutated from client paths.
- Role behavior is documented and verified against expected scope.
- Policy verification checklist is complete and stored in docs.

### 3) Admin Queue Usability Upgrade (P1)
Refactor the triage queue to a reusable table-driven interaction model with faster decision loops.

#### Tasks
1. Introduce reusable table primitives for queue rows (sorting/filtering/pagination baseline).
2. Keep and refine high-value filters:
   - missing documents
   - recent submissions
   - awaiting parent action
3. Add column visibility and deterministic sorting defaults for admissions triage.
4. Add row-level quick actions for verify/re-upload/status transitions where safe.

#### Acceptance Criteria
- Admin can isolate a target queue slice within 2 interactions.
- Queue ordering is predictable and stable.
- "Next action" identification target remains under 10 seconds.

### 4) Upload Experience and Recovery Clarity (P1)
Improve parent confidence in document handling and reduce avoidable rework.

#### Tasks
1. Add explicit upload progress and success/failure messaging hierarchy.
2. Preserve duplicate-file warning and add "replace with newer file" guidance.
3. Standardize review-state language (`clear`, `review`, `replace`) in parent/admin copy.
4. Ensure failed uploads guide retry steps without losing draft context.

#### Acceptance Criteria
- Parents can distinguish format/size errors vs connectivity failures.
- Re-upload guidance is clear and consistent across parent/admin surfaces.
- Upload recovery does not erase previously saved valid documents.

### 5) Observability and KPI Instrumentation (P1)
Wire performance and operational signals into daily execution rhythm.

#### Tasks
1. Enable and verify Vercel Speed Insights and Observability usage in workflow.
2. Add daily KPI capture block in checkpoint routine:
   - completion rate
   - stage drop-off
   - re-upload rate
   - review turnaround
3. Add lightweight incident trend log linking issue type to affected stage.
4. Publish weekly summary template tied to pilot readiness review.

#### Acceptance Criteria
- Daily checkpoint includes performance + operational KPI evidence.
- At least one weekly trend summary is produced during sprint.
- Top recurring risk has owner and mitigation action.

## Execution Cadence
- Daily start: choose top parent blocker + top admin blocker.
- Midday: verify touched flow on mobile viewport and desktop admin queue.
- End-of-day: update checkpoint with evidence, regressions, and carry-over risk.

## Deliverables
- Updated parent/auth form behavior with clear states.
- Verified authorization and RLS behavior checklist.
- Admin queue usability uplift (table-driven filtering/sorting/actions).
- Upload recovery UX improvements.
- KPI + observability integrated daily/weekly operating routine.

## Definition of Done
1. P0 workstreams complete and validated.
2. P1 workstreams complete or carry-over risks explicitly documented.
3. Critical parent/admin journeys pass regression checks.
4. Daily checkpoint artifacts contain measurable KPI evidence.
5. Stakeholder-ready summary produced for pilot planning review.

## First 48-Hour Push
1. Lock Sprint D acceptance checks and assign owners.
2. Implement parent pending/error/submit-state consistency.
3. Complete RLS and role-scope verification checklist draft.
4. Refactor admin queue into table baseline with preserved filters.
5. Publish first Sprint D checkpoint with pass/fail evidence.
