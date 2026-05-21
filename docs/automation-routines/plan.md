# Automation Routines Plan

## Status

Draft

## Summary

Build two small routines first: a session bootstrap check and a session handoff packet generator. Both should be scriptable, low-noise, and close to the project source of truth.

## Scope

This plan covers:

- a bootstrap routine that verifies the workspace and integrations before feature work starts
- a handoff routine that captures the current state in a short, reusable packet

It does not cover continuous background monitoring or large workflow orchestration.

## Goals

- Make new sessions recoverable in under a minute.
- Reduce repeated setup prompts.
- Keep GitHub, Vercel, Supabase, and Linear state visible at the start of work.
- Produce a handoff packet that another session or platform can use immediately.
- Keep the scripts simple enough that they are easy to trust and maintain.

## Non-Goals

- Full CI replacement.
- Long-running daemon processes.
- Auto-fixing code issues.
- Replacing Linear or docs with generated state.

## Proposed Implementation

### Routine 1: Session Bootstrap

Create a small script that:

- checks the current branch
- checks GitHub auth
- checks Vercel auth
- checks Supabase auth and linked project
- confirms the intended Linear project or team is available
- prints a short pass/fail summary
- exits nonzero if a critical check fails

Suggested file shape:

- `scripts/bootstrap-session.sh`

Suggested behavior:

- safe to run repeatedly
- no destructive actions
- concise output
- clear failure classification

### Routine 2: Session Handoff Packet

Create a small script that:

- captures branch and repo state
- captures the active surface (`src/`, `dev/`, or `supabase/`)
- captures the last coherent slice
- captures blockers and known issues
- prints a markdown handoff packet to stdout
- optionally copies the packet to the clipboard when available

Suggested file shape:

- `scripts/session-handoff.sh`

Suggested behavior:

- reads from the repo state and the continuity docs
- keeps the packet short
- avoids rewriting durable docs unless the user asks for that

## Implementation Sequence

1. Add the bootstrap script.
2. Add the handoff script.
3. Link both routines from `docs/SESSION_CONTINUITY.md` and `README.md`.
4. Test both scripts in a healthy session.
5. Add any repeat failures to `docs/QUICKFIX_KB.md`.

## Validation

The routines are considered ready when:

- bootstrap reports the correct auth and project state
- handoff produces a readable packet without manual cleanup
- both scripts are easy to rerun without side effects
- the output is short enough that it does not create token churn

## Update Cadence

- Update the bootstrap routine when auth or connector behavior changes.
- Update the handoff routine when the canonical sources of truth change.
- Update this plan only when the implementation approach changes.

## Open Questions

- Should the bootstrap script be shell-only or a small Node script for easier formatting?
- Should the handoff packet also write to a file, or stay stdout-only by default?
- Should clipboard copy be optional or always on when available?

## Decision

Start with shell scripts, keep the first version minimal, and optimize for reliability over cleverness.
