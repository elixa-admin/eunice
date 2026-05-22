# Session Continuity & Handoff

This is the short recovery guide for when a coding session is interrupted, a token limit is reached, or the work needs to move to another platform.

## Purpose

Keep one clear path back into the project so a new session can recover the current state without guesswork.

## Canonical Sources

- `src/` is the product app source of truth.
- `dev/` is the preview and exploration surface.
- `supabase/` is the schema and migration source of truth.
- `docs/` holds the operating rules, plans, and decisions.
- `Linear` is the planning and ownership source of truth when a workstream is tracked there.

## What A New Session Should Read First

1. [SOURCE_OF_TRUTH.md](./SOURCE_OF_TRUTH.md)
2. [README.md](../README.md)
3. [SESSION_MANIFEST.md](./SESSION_MANIFEST.md)
4. [SESSION_CONTINUITY.md](./SESSION_CONTINUITY.md)
5. [SESSION_BOOTSTRAP.md](./SESSION_BOOTSTRAP.md)
6. [TOOLING_POLICY.md](./TOOLING_POLICY.md)
7. [AUTOMATION_POLICY.md](./AUTOMATION_POLICY.md)
8. [RELAY_PLAYBOOK.md](./RELAY_PLAYBOOK.md)
9. [automation-routines/plan.md](./automation-routines/plan.md)
10. [FAILURE_TRIAGE.md](./FAILURE_TRIAGE.md)
11. [QUICKFIX_KB.md](./QUICKFIX_KB.md)
12. The current phase or feature docs for the active workstream
13. The active Linear project or issue thread for the workstream

## Minimum Recovery Checklist

- Confirm the branch and remote branch state.
- Confirm GitHub, Supabase, Vercel, and Linear access if the work depends on them.
- Confirm which surface is active: `src/`, `dev/`, or `supabase/`.
- Confirm the last coherent slice of work and the next intended slice.
- Confirm whether any known issue belongs in `QUICKFIX_KB.md`.

## Handoff To Another Platform

When moving work to Claude Code or any other platform:

- Copy or point to this same doc set first.
- Start with the same source-of-truth order.
- Carry forward the active branch, commit, surface, and integration state.
- Keep the handoff note short and factual.
- Do not re-document the full history if the durable docs already contain it.

### Suggested Handoff Packet

```text
Project: Eunice
Branch: <current branch>
Commit: <latest stable commit>
Surface: src | dev | supabase
Active work: <one sentence>
Integrations: GitHub ok / Supabase ok / Vercel ok / Linear ok
Known blockers: <if any>
Next slice: <one sentence>
Read first: README, SESSION_CONTINUITY, SESSION_BOOTSTRAP, TOOLING_POLICY, FAILURE_TRIAGE, QUICKFIX_KB
```

## Update Cadence

Update the durable docs when something materially changes, not on every small edit.

- `SESSION_BOOTSTRAP.md` and `TOOLING_POLICY.md`: update when auth, connectors, or operating rules change.
- `SESSION_MANIFEST.md`: update when the repo root, read order, or source-of-truth map changes.
- `AUTOMATION_POLICY.md` and `automation-routines/plan.md`: update when the routines, triggers, or handoff behavior change.
- `RELAY_PLAYBOOK.md`: update when the working loop, recurring-issue method, or relay packet changes.
- `QUICKFIX_KB.md`: update when the same issue recurs or a workaround becomes the standard path.
- `QUICKFIX_KB.md`: keep configs, keys, auth recovery, and connector workarounds documented once they are verified and reusable across platforms.
- `README.md`: update when entry points, links, or source-of-truth locations change.
- Linear: update after each coherent slice, milestone, or ownership change.
- GitHub: push when a slice is coherent, preview-worthy, or ready to hand off.

## Token-Safe Rule

- Batch related updates together.
- Avoid refreshing durable docs on every keystroke.
- Prefer one clear restart packet over a long session transcript.
- If a session may end soon, write the handoff packet before stopping.
