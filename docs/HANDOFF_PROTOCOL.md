# Handoff Protocol

## Purpose

This document defines the shared handoff format used by Codex, Claude Code, and Antigravity IDE in this workspace.

The goal is simple: when one platform ends a substantial session, the next platform should be able to continue without re-reading the entire thread or guessing at the current state.

## Core Rules

1. Use one Markdown handoff format everywhere.
2. Write handoffs to the OS temp directory, not to the workspace by default.
3. Skip handoff generation on quiet, admin-only, or non-coding days.
4. Generate or refresh handoffs only when the session was substantial or is clearly winding down.
5. Redact secrets, tokens, passwords, and personal data.
6. Reference existing repo artifacts instead of repeating them.
7. Keep the format versioned so future changes are explicit.

## Version

- `handoff_format_version: 1`

## Required Fields

Every handoff should include these sections in this order:

1. `# Handoff: <Platform> Session`
2. `## Snapshot`
3. `## Why This Exists`
4. `## Heuristic Summary`
5. `## Current Thread Notes`
6. `## Open Items`
7. `## Suggested Skills`
8. `## Source Pointers`

## Snapshot Section

The snapshot should include:

- generated timestamp
- conversation ID
- workspace path(s)
- transcript path
- artifact directory path
- handoff format version

## Heuristic Summary

The summary should say whether the session was substantial and why the handoff was produced.

Recommended threshold:

- about 80 non-empty transcript lines, or
- clear coding/tool activity, or
- an explicit closeout request from the user

## Local Usage Estimate

Because the live `/status` meter may not be visible in every Codex surface, use a local estimator as a proxy when useful.

The estimator should combine:

- transcript line count
- tool activity count
- transcript word count

Suggested interpretation:

- under 65 percent: normal
- 65 to 84 percent: priority
- 85 percent and above: wrap

This estimate is only a guide. It should not override obvious product signals or the user's explicit intent.

## Usage Threshold Reminder

When useful, the workspace may also run `scripts/session-usage-monitor.mjs` to watch for threshold reminders at:

- 65 percent
- 85 percent
- 95 percent

The monitor should only be invoked during active coding sessions. If there has been no meaningful work, do not run it.

## Current Thread Notes

Capture only the useful working state:

- what changed
- what decisions were made
- what is still in progress
- what the next agent needs to know immediately

## Open Items

List the unresolved items that matter for the next agent. If there are none, say so explicitly.

## Suggested Skills

Include the skills or workflows the next agent should consider. Keep the list short and practical.

## Source Pointers

Reference the existing artifacts that already contain full detail, such as:

- docs
- plans
- PRDs
- issue links
- commit hashes
- diff paths

Do not duplicate long-form content that already lives elsewhere.

## Platform Contract

### Codex

- Use the `handoff` skill as the closeout workflow.
- Emit a temp-file handoff using this protocol.

### Antigravity IDE

- Use a Stop hook plus `scripts/antigravity-handoff.mjs`.
- Read the transcript and generate the same protocol format.

### Claude Code

- Use the local instruction file and `scripts/claude-handoff.mjs`.
- Follow the same protocol and the same skip rules.

## Loopback Rule

Whenever a session crosses a meaningful boundary, the current platform should either:

1. write a handoff, or
2. prompt the user to decide whether a handoff should be generated or refreshed.

The next platform should always be able to load the handoff and continue from the same shared state.
