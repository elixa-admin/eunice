# Automation Policy

This repo should automate the repeatable parts of the work, not the judgment calls.

## Purpose

Reduce re-prompting, keep sessions recoverable, and avoid wasting tokens on checks we can run the same way every time.

## What To Automate

- Session bootstrap checks.
- Session handoff packets.
- Connector and CLI health checks.
- Failure triage prompts and QuickFix capture.
- Pre-push verification for coherent slices.
- Lightweight Linear sync for durable planning updates.
- Usage budget checks at sprint and publishing boundaries.

## What Not To Automate

- Product decisions.
- Architecture tradeoffs that need review.
- Code review judgment.
- Anything that would create duplicate sources of truth.
- Long-running polling that burns tokens or compute without a clear state change.

## Operating Rules

- Automate only tasks that are repeatable, scriptable, and close to the source of truth.
- Keep each routine narrow and easy to explain.
- Run routines only at meaningful boundaries:
  - session start
  - slice end
  - before push or handoff
  - after auth or config changes
  - after a repeated failure
- Prefer a single short report over a large transcript.
- If a routine uncovers a recurring problem, record the fix in `docs/QUICKFIX_KB.md`.
- If a routine changes durable project state, update the repo docs or Linear once, not in multiple places.

## Default Frequency

- `Session bootstrap`: every new session and after tool/auth resets.
- `Handoff packet`: every coherent slice and before pause.
- `Connector health`: session start, then only after auth/config changes.
- `Failure triage`: after a retry fails or a failure repeats.
- `Pre-push gate`: before any push-worthy slice.
- `Linear sync`: when scope, ownership, or status materially changes.
- `Usage budget check`: session start, after each sprint, and before push/handoff/publish.

## Source Of Truth

- `src/` for product code.
- `dev/` for preview work.
- `supabase/` for schema and migrations.
- `docs/` for operating rules and decisions.
- `Linear` for planning and ownership when a workstream lives there.

## First Routines

The first routines to build are:

1. Session bootstrap.
2. Session handoff packet.

Those two give us the best restart and recovery value for the smallest amount of automation.
