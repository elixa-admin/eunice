# Relay Playbook

This file is the operating method for any new assistant, IDE, or platform that picks up the Eunice project after a pause or handoff.

## Purpose

Keep the next session aligned with the same project state, the same sources of truth, and the same recurring-failure methodology.

## Read First

1. [SESSION_MANIFEST.md](./SESSION_MANIFEST.md)
2. [README.md](../README.md)
3. [SESSION_CONTINUITY.md](./SESSION_CONTINUITY.md)
4. [SESSION_BOOTSTRAP.md](./SESSION_BOOTSTRAP.md)
5. [TOOLING_POLICY.md](./TOOLING_POLICY.md)
6. [AUTOMATION_POLICY.md](./AUTOMATION_POLICY.md)
7. [FAILURE_TRIAGE.md](./FAILURE_TRIAGE.md)
8. [QUICKFIX_KB.md](./QUICKFIX_KB.md)

## Required Method

- Check the project root, current branch, and active surface before changing code.
- Check GitHub, Supabase, Vercel, and Linear access when the work depends on them.
- Use the source of truth that is closest to the work:
  - `src/` for product code
  - `dev/` for preview and experimentation
  - `supabase/` for schema and migrations
  - `docs/` for durable rules and decisions
  - `Linear` for planning and ownership when the workstream is tracked there
- Prefer the narrowest tool that can complete the task cleanly.
- Avoid re-discovering state that is already documented.

## Default Work Loop

Use this loop for normal project work:

1. Brainstorm.
2. Enlist the relevant skills, connectors, or CLIs.
3. Plan the smallest coherent slice.
4. Review the current state and constraints.
5. Recommend the best path if there is a tradeoff.
6. Build the slice.
7. Execute the checks and verification.
8. Commit the change when the slice is successful.
9. Review the result and update durable docs if the state changed.

If the slice succeeds, update the committed source of truth and the matching durable docs or tracker items that represent that slice. Do not duplicate the same final state in multiple places unless one of them is the explicit source of truth for that domain.

## Recurring Issues Methodology

When a problem repeats, do not keep trying the same path.

1. Retry once if the issue looks transient.
2. Classify the issue as `network`, `config`, or `code`.
3. Switch to the matching fallback.
4. If the same issue keeps recurring, record the fix in `QUICKFIX_KB.md`.
5. If the issue changes startup behavior or authentication, update `SESSION_BOOTSTRAP.md` or `TOOLING_POLICY.md`.

## Config, Keys, and Integrations

- Treat auth, tokens, and connector permissions as part of the working setup, not as afterthoughts.
- If a connector or CLI login is flaky but recoverable, record the stable recovery path once it is confirmed.
- If a workspace link, project root, or environment setting changes, update the durable docs once the new state is verified.
- If another platform is taking over, ensure it reads the same manifest and quick-fix notes before editing.

## Relay Packet

When handing off, include:

- branch
- latest stable commit
- active surface
- current slice
- integrations status
- known blockers
- next slice

## Update Cadence

- Update this doc when the handoff method changes.
- Update `QUICKFIX_KB.md` when a recurring issue is solved and verified.
- Update `SESSION_MANIFEST.md` when the startup order or project identity changes.
- Update `SESSION_BOOTSTRAP.md` when auth or connector checks change.

## Token-Safe Rule

- Keep the handoff short.
- Write durable state once per coherent slice.
- Do not duplicate the same workaround in multiple docs unless the startup path needs it.
