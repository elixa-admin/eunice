# Next Sprint Micro-Slices (High Value, Low Token Burn)

Last updated: 2026-05-22
Branch: `codex/vercel-project-separation`
Primary surface: `dev/`

## Sprint Goal

Ship a visibly professional parent intake + admin operations experience in tiny deterministic slices, with each slice commit-ready and preview-verifiable.

## Execution Rules

- One slice at a time, one coherent commit per slice.
- No local render loops unless a regression cannot be validated in preview.
- After each slice: update `docs/SOURCE_OF_TRUTH.md`, push branch, verify Vercel preview status.
- Linear update once per slice if connector is healthy; if `401`, log once and continue.

## Slice 1 (Highest Visual ROI): Typography + Hierarchy Correction

### Why this first

The biggest current perception gap is typography quality and hierarchy polish.

### Scope

- Replace cartoonish display/body combinations with professional UI pairings already aligned in `docs/UI_THEME_SPEC.md`.
- Tighten heading scale, card titles, metadata text, line-height, and spacing rhythm.
- Keep existing structure and flows unchanged.

### Files (expected)

- `dev/app/globals.css`
- `dev/app/dev/admin/page.tsx`
- `dev/app/dev/parent/page.tsx`

### Done when

- Header, cards, and table/list text read as product UI, not wireframe.
- Visual hierarchy is obvious in one screen glance.

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
