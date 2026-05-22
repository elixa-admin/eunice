# Session Manifest

This is the shortest possible starting point for a new assistant session.

## Project Identity

- Project: Eunice School Intake Platform
- Repo root: `/Users/brandondienar/Documents/Codex/Projects/Eunice`
- GitHub: `elixa-admin/eunice`
- Primary work surfaces:
  - `src/` for the product app
  - `dev/` for the preview and exploration surface
  - `supabase/` for schema and migrations
  - `shared/` for cross-surface contracts that must stay aligned

## Read First

1. [SOURCE_OF_TRUTH.md](./SOURCE_OF_TRUTH.md)
2. [HANDOVER_BOOTSTRAP_PROMPT.md](./HANDOVER_BOOTSTRAP_PROMPT.md)
3. [PLATFORM_RELAY_PROTOCOL.md](./PLATFORM_RELAY_PROTOCOL.md)
4. [README.md](../README.md)
5. [SESSION_MANIFEST.md](./SESSION_MANIFEST.md)
6. [SESSION_CONTINUITY.md](./SESSION_CONTINUITY.md)
7. [SESSION_BOOTSTRAP.md](./SESSION_BOOTSTRAP.md)
8. [TOOLING_POLICY.md](./TOOLING_POLICY.md)
9. [AUTOMATION_POLICY.md](./AUTOMATION_POLICY.md)
10. [COMMAND_DIALECT.md](./COMMAND_DIALECT.md)
11. [ARCHITECTURE_REVIEW_CADENCE.md](./ARCHITECTURE_REVIEW_CADENCE.md)
12. [USAGE_BUDGET_POLICY.md](./USAGE_BUDGET_POLICY.md)
13. [RELAY_PLAYBOOK.md](./RELAY_PLAYBOOK.md)
14. [FAILURE_TRIAGE.md](./FAILURE_TRIAGE.md)
15. [QUICKFIX_KB.md](./QUICKFIX_KB.md)
16. The current phase or feature docs for the active workstream
17. The active Linear project or issue thread for the workstream

## Source Of Truth Map

- `src/`: product code and shared business logic.
- `dev/`: preview work, experiments, and UI exploration.
- `supabase/`: database schema, migrations, and data contracts.
- `shared/`: cross-surface contracts consumed by both `src/` and `dev/`.
- `docs/`: durable operating rules, plans, and decisions.
- `Linear`: planning, ownership, and status when the workstream is tracked there.

## Working Rules

- Use the narrowest tool that reaches the source of truth with the fewest handoffs.
- Prefer CLI for deterministic repo-local work.
- Use connectors for remote state and review workflows.
- Use the browser only when a rendered UI or authenticated web session is needed.
- Keep one common goal across code, docs, and tracker for each workstream.
- Use the default work loop: brainstorm, enlist skills, plan, review, recommend, build, execute, commit, review.
- Use the command dialect registry when translating a shared intent into a platform-native command.
- Use the architecture review cadence as a light ongoing check, not a constant redesign loop.
- Use the usage budget policy to tighten sprint size as headroom drops.
- Do not duplicate a durable decision in multiple places.
- Update docs at coherent slice boundaries, not after every tiny edit.
- If a known issue recurs, update `QUICKFIX_KB.md` after the fix is verified.
- If a connector, key, or config workaround becomes the standard recovery path, document it once and reuse it across platforms.

## Startup Checks

- Confirm branch and remote state.
- Confirm GitHub, Supabase, Vercel, and Linear access when relevant.
- Confirm the active surface.
- Confirm the last coherent slice and the next intended slice.
- Confirm whether the current work belongs in `QUICKFIX_KB.md`.

## Relay Packet

When handing off to Claude Code, AntiGravity IDE, or another session:

```text
Project: Eunice
Repo root: /Users/brandondienar/Documents/Codex/Projects/Eunice
Branch: <current branch>
Commit: <latest stable commit>
Surface: src | dev | supabase
Active work: <one sentence>
Integrations: GitHub ok / Supabase ok / Vercel ok / Linear ok
Known blockers: <if any>
Next slice: <one sentence>
Read first: SOURCE_OF_TRUTH, HANDOVER_BOOTSTRAP_PROMPT, PLATFORM_RELAY_PROTOCOL, README, SESSION_MANIFEST, SESSION_CONTINUITY, SESSION_BOOTSTRAP, TOOLING_POLICY, AUTOMATION_POLICY, COMMAND_DIALECT, ARCHITECTURE_REVIEW_CADENCE, USAGE_BUDGET_POLICY, FAILURE_TRIAGE, QUICKFIX_KB
```

## Update Cadence

- Update this file when the project root, source-of-truth map, or read order changes.
- Update `SESSION_CONTINUITY.md` when handoff behavior or update cadence changes.
- Update `SESSION_BOOTSTRAP.md` when auth or connector health checks change.
- Update `TOOLING_POLICY.md` when tool selection or source-of-truth rules change.
- Update `RELAY_PLAYBOOK.md` when the relay or recurring-issue methodology changes.
