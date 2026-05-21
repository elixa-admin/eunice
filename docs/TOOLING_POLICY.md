# Tooling Policy

This repo should use the fastest reliable path for each task while keeping the source of truth clear and the token footprint low.

## Tool Selection Rule

Choose the narrowest tool that can act closest to the source of truth with the fewest translations.

## Preferred Order

1. Direct connector or app integration when the source of truth lives in a remote system and the connector can write to it cleanly.
2. CLI / terminal commands when the work is deterministic, scriptable, repo-local, or infra-local.
3. Native/local app UI when that app is the real interface and is more reliable than the browser.
4. Browser automation when the task needs a rendered web UI, authenticated session, or preview check.
5. Full computer use only when none of the above can complete the task.

## Default Tool Choice

- Use the narrowest tool that can reach the source of truth with the fewest hops.
- Use connectors for structured remote workflows and review threads.
- Use CLI for deterministic, repeatable, repo-local, or infra-local work.
- Use browser automation for visual, interactive, or dashboard-only work.
- Use full computer control only when the first four choices cannot complete the task.

## Default Work Loop

For normal work, follow this order:

1. Brainstorm.
2. Enlist the relevant skills or tools.
3. Plan the smallest coherent slice.
4. Review the current state and constraints.
5. Recommend the best path when there is a tradeoff.
6. Build the slice.
7. Execute checks and verification.
8. Commit once the slice is successful.
9. Review the result and update the durable source of truth.

If the work succeeds, update the committed source code, matching docs, and any active tracker item that owns the slice. Keep one durable version of the truth per domain.

## CLI First

Prefer CLI for:

- Git operations
- GitHub repository management and PR creation
- Vercel project setup, pulls, builds, and deploys
- Supabase migrations and local verification
- Tests, linting, type checks, and build commands
- Repo-local file inspection and edits

## Connectors When They Win

Prefer connectors when they save time or preserve context better than raw CLI:

- GitHub app for PR metadata, review comments, and CI triage
- Linear for issue tracking, sprint planning, status updates, and ownership tracking
- Google Drive for source documents that already live there
- Figma for design-system-aware visual work

## Browser Only When Needed

Use the browser for:

- Visual validation of previews and UI changes
- Dashboard settings that are not cleanly exposed in CLI
- Authenticated flows that require a real session
- Screenshots or interaction checks that need a rendered page

## Desktop Fallback

Use full computer control only when:

- the browser cannot reach the target system
- the target is a native app or desktop workflow with no better interface
- a remote session needs general GUI interaction that the browser cannot provide

## Service Defaults

- GitHub: `git` + `gh` first; GitHub app when PR metadata, review comments, or CI triage matter.
- Vercel: CLI first for `link`, `pull`, `build`, and deploys; dashboard only for project settings the CLI cannot cleanly change.
- Supabase: CLI and SQL first for schema and migrations.
- Linear: connector is the task source of truth for issue tracking, planning, status updates, and ownership when a workstream is being tracked there.
- Browser: real preview checks, screenshots, UI sanity, and authenticated sessions.
- Desktop control: only when the task cannot be completed through connector, CLI, or browser.

## Token Economy

- Batch related checks instead of re-reading the same files repeatedly.
- Prefer local config and linked project metadata over re-discovery.
- Keep shared rules in `src/lib`, not duplicated in routes or previews.
- Avoid parallel implementations unless one is explicitly being retired.
- Do not turn transient notes into permanent source of truth.
- Prefer the tool that writes closest to the source of truth and requires the fewest handoffs.
- When a system has both a connector and CLI, pick the one that can complete the task cleanly with the least context switching rather than following a rigid one-size-fits-all order.
- If work is tracked in Linear, create or update the issue there instead of duplicating the same task list in docs.
- Start each coding session with the session bootstrap checks in `docs/SESSION_BOOTSTRAP.md`.
- Use `docs/COMMAND_DIALECT.md` and `EUNICE_AI_PLATFORM` when translating a shared intent into a platform-native command.
- Use `docs/USAGE_BUDGET_POLICY.md` to decide when to keep normal sprint size and when to switch into priority or wrap-up mode.
- If a command fails repeatedly, classify it using `docs/FAILURE_TRIAGE.md` and record recurring bugs in `docs/QUICKFIX_KB.md`.

## Source of Truth

- `src/` is the product app source of truth.
- `dev/` is the preview and exploration surface.
- `supabase/` is the schema and migration source of truth.
- `shared/` holds the contract layer that both `src/` and `dev/` must reuse when one vocabulary is required across surfaces.
- `docs/` holds the operating rules, plans, and decisions.
- `Linear` is the planning and ownership source of truth when a workstream is tracked there.

## Alignment Rule

- Keep one common goal across code, docs, and tracker for each workstream.
- Do not duplicate the same decision in multiple places unless it is a short pointer back to the real source of truth.
- If a rule changes in code, update the matching doc or tracker item in the same slice.
- If planning changes in Linear, reflect only the durable outcome in docs.
- If the repo, docs, and tracker disagree, stop and reconcile before adding more work.

## Handoff Cadence

- Before pausing a workstream, write a short handoff packet in `docs/SESSION_CONTINUITY.md`.
- When a session is moving to Claude Code or another platform, start from the same bootstrap and continuity docs instead of reconstructing context from memory.
- Update durable docs at the end of a coherent slice, not after every tiny edit.
- Treat repo pushes as the durable checkpoint for previewable or handoff-ready slices.
- If the same auth or connector issue repeats, update `docs/QUICKFIX_KB.md` once the fix is known.

## Architecture Review Cadence

- Run a micro-review at the end of every sprint.
- Run a fuller architecture review after each major phase.
- Run a deeper architecture and tool review once a week.
- Keep the reviews light and focused on changed assumptions, duplicated logic, stale tools, or a better open-source replacement.
- If a review changes the shape of the system, update the matching docs and source of truth in the same slice.

## Practical Rule

If a task can be done cleanly with CLI, use CLI.
If remote state or review context matters more, use the connector.
If humans need to see or click it, use the browser.
