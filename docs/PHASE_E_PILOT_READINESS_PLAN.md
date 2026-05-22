# Phase E Plan: Pilot Readiness and Launch Stability

Date: 2026-05-22

## Goal
Prepare the Eunice admissions platform for a controlled pilot by tightening communications, operational controls, monitoring, and support readiness.

## Context
Once the data model and workflow states are solid, the remaining work is operational:

- make the admissions journey dependable for parents
- make admin follow-up efficient
- make the deployment path predictable
- make it easy to support the school during the first live cycle

This phase assumes the core product is already coherent and focuses on the last-mile details that matter during real admissions use.

## Shared Decisions

- Keep the product faithful to Eunice’s brand and workflow.
- Keep the pilot scope tight; avoid feature creep.
- Prefer operational reliability over new feature breadth.
- Make support and recovery paths explicit.
- Record launch assumptions and issues in checkpoints and Linear.

## Task 1: Parent Communication Readiness

### Goal
Make the parent journey feel responsive and easy to understand during real admissions use.

### Context
Parents need reassurance about what happens next, what was received, and what still needs attention.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_NEXT_INTAKE_UX.md`

### Proposed approach
- Define the key parent-facing status and reminder moments.
- Make the application flow messaging consistent and calm.
- Keep the “what happens next” cues simple and visible.

### Acceptance criteria
- Parents can understand their current stage without support.
- Status wording feels formal and reassuring.
- Next-step cues are present without clutter.

### Verify
- Review the parent portal end-to-end from first load through review state.

### Out of scope
- Complex notification orchestration.

## Task 2: Admin Operational Readiness

### Goal
Make the admin dashboard reliable for day-to-day admissions work during the pilot.

### Context
Staff need quick access to queue status, document issues, notes, and actions without having to interpret the system.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx`

### Proposed approach
- Make queue states and document issues easy to scan.
- Keep reviewer actions obvious and low-friction.
- Ensure notes and re-upload responses are stable and traceable.

### Acceptance criteria
- Admins can triage applications quickly.
- The interface supports repetitive daily use without confusion.
- Review actions remain aligned with the canonical state model.

### Verify
- Walk a sample queue and document review through the admin surface.

### Out of scope
- Redesigning the admin theme again.

## Task 3: Deployment and Monitoring Stability

### Goal
Make the GitHub → Vercel preview/release path boring and predictable.

### Context
Pilot work only succeeds if branch changes are visible quickly and deployment issues are obvious.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/.vercel`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_CONTINUITY.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/TOOLING_POLICY.md`

### Proposed approach
- Keep the branch publishing loop consistent.
- Record any deployment caveats once in durable docs.
- Treat preview checks as the normal review path.

### Acceptance criteria
- The preview path is understood and repeatable.
- Deployment state is easy to explain in a fresh session.
- The branch preview remains the main review surface.

### Verify
- Confirm the branch push reaches GitHub and updates Vercel preview as expected.

### Out of scope
- Production cutover.

## Task 4: Pilot Support and Handoff

### Goal
Leave the team with a clear support path and launch checklist for the first live cycle.

### Context
The first live use will surface real-world issues. We need a short, actionable support and response plan.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/CHECKPOINT_PHASE_B_2026-05-22.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_CONTINUITY.md`

### Proposed approach
- Document the minimum launch checklist.
- Document how to recover from common operational issues.
- Capture unresolved assumptions for the next school feedback round.

### Acceptance criteria
- A new session can pick up the pilot support plan quickly.
- The team knows where to look when something goes wrong.
- Open questions are separated from confirmed launch decisions.

### Verify
- Review the final handoff note with no other context.

### Out of scope
- New admissions policy decisions.

## Recommended Order
1. Parent communication readiness.
2. Admin operational readiness.
3. Deployment and monitoring stability.
4. Pilot support and handoff.

