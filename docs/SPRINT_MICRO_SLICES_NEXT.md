# Next Sprint Micro-Slices (High Value, Low Token Burn)

Last updated: 2026-05-24
Branch: `codex/vercel-project-separation`
Primary surface: `dev/`

## Sprint Goal

Adopt the latest screenshot references as the visual north star for the `dev/` surface, then carry that system through the parent and admin preview experiences in tiny deterministic slices.

## Current Sprint Pointer

The full current sprint plan now lives in [docs/SPRINT_NEXT_LANDSCAPE_UI.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_NEXT_LANDSCAPE_UI.md). Use that document for the next full-sprint sequence; keep this file as the low-token micro-slice queue when you want the smallest next step.

## GitHub Coordination Note

- GitHub repository: `elixa-admin/eunice`
- GitHub issue creation from the integration is currently blocked by repository permissions (`Resource not accessible by integration`)
- Use this file as the sprint board source of truth until issue access is restored

## Execution Rules

- One slice at a time, one coherent commit per slice.
- No local render loops unless a regression cannot be validated in preview.
- After each slice: update `docs/SOURCE_OF_TRUTH.md`, push branch, verify Vercel preview status.
- Linear update once per slice if connector is healthy; if `401`, log once and continue.

## Slice 1 (Highest Visual ROI): Dev Surface Theme Foundation

### Why this first

The biggest current perception gap is the overall brand frame: top bar, page canvas, card geometry, and the premium academic feel.

### Scope

- Strengthen the shared `dev/` chrome so the top bar, background, borders, and shadows match the screenshot direction.
- Tighten heading scale, card titles, metadata text, line-height, spacing rhythm, and status chip treatment.
- Keep existing structure and flows unchanged.

### Files (expected)

- `dev/app/globals.css`
- `dev/app/layout.tsx`
- `dev/components/preview-shell.tsx`
- `dev/components/nav.tsx`

### Done when

- Header, canvas, and cards read as a cohesive admissions product frame.
- The `dev/` preview feels closer to the screenshot reference family at a glance.

## Slice 2 (Parent Flow ROI): 13-page Compression into Guided 5-step Journey

### Why this second

Highest product value is reducing parent friction while preserving Eunice intake requirements.

### Scope

- Implement a "Before you begin" checklist block.
- Present clear 5-step progression with section purpose and expected time.
- Add "what happens next" expectation cue after each step.
- Keep existing data contract and document rules.

### Files (expected)

- `dev/app/dev/parent/page.tsx`
- `dev/lib/dev-preview-data.ts`

### Done when

- Parent can see required docs upfront.
- Parent knows progress state and next action at all times.
- Flow feels guided rather than endless paging.

## Slice 3 (Admin ROI): Queue Health and Stuck-State Visibility

### Why this third

Admin speed depends on instantly seeing blockers, waiting states, and ready-to-decide records.

### Scope

- Add lightweight progress heat indicators to queue cards.
- Add "waiting on parent", "waiting on school", and "ready for decision" micro-status chips.
- Add simple completion indicators per application card.

### Files (expected)

- `dev/app/dev/admin/page.tsx`
- `dev/lib/dev-preview-data.ts`

### Done when

- One glance answers: what is blocked, what is waiting, what can be decided now.
- Card coloring supports action without overwhelming the interface.

## Slice 4 (Trust ROI): Handover + Bootstrap Hardening

### Why this fourth

If session context dies, work must continue without friction.

### Scope

- Keep `SESSION_INTEGRATION_MEMORY`, `SOURCE_OF_TRUTH`, and checkpoint docs in sync with latest slice outcomes.
- Ensure startup command and required env key coverage remain accurate.

### Done when

- New agent can continue work from docs without chat history.
- No ambiguity on next slice.

## Next Sprint Framing

The next sprint should stay focused on the smallest visible product improvements that make the parent and admin surfaces feel real:

1. Establish the `dev/` visual foundation so the screenshot theme is visible everywhere.
2. Rework the parent preview rhythm so the guided application feels calm and premium.
3. Recast the admin review surface so queue health and next actions are obvious.
4. Keep the handover docs aligned so the next session can continue without reorientation.

## Stop Conditions (Token Safety)

- Stop after any slice that introduces failing checks and open a focused fix slice.
- Stop if usage budget reaches wrap-up threshold; publish handover docs before pausing.
- Do not start Slice N+1 until Slice N is pushed and preview-validated.

## Per-Slice Delivery Checklist

1. Implement smallest coherent UI/flow change.
2. Run bounded verification for touched surface.
3. Update durable docs (`SOURCE_OF_TRUTH` + checkpoint).
4. Commit and push to GitHub.
5. Confirm Vercel preview is Ready.
6. Attempt one Linear status update (no retry loop on `401`).
