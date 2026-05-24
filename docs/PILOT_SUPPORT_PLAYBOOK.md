# Pilot Support Playbook

## Scope
Operational triage playbook for Eunice intake pilot support during Sprint C, Sprint D, and pilot launch.

## Incident Priorities
- P0: Parent cannot submit application or admin cannot access queue.
- P1: Upload/re-upload path broken, status updates failing, or reminder flow blocked.
- P2: Visual/layout issue with available workaround.

## Response Targets
- P0: acknowledge in 15 minutes, fix/rollback within 2 hours.
- P1: acknowledge in 30 minutes, fix within same business day.
- P2: triage in daily checkpoint and schedule in next sprint slice.

## Triage Steps
1. Reproduce in parent or admin flow.
2. Capture app ID, user role, timestamp, and failure step.
3. Check auth/session state, document status, and submission state.
4. Apply workaround if possible (re-login, re-upload, draft restore).
5. Log resolution and follow-up task.

## Parent-Facing Recovery Guidance
- If upload fails: retry once, switch network, then re-upload the same document type.
- If draft appears missing: re-open the same account session and refresh the portal.
- If status is awaiting documents: replace files marked for re-upload and resubmit.

## Escalation
- Escalate to engineering immediately for any repeated P0/P1 in a 24-hour window.
- Escalate to school operations when a policy decision is needed (document acceptance exception).
