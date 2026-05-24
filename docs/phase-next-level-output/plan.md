# Phase: Next-Level Output

Last updated: 2026-05-24  
Branch: `codex/vercel-project-separation`  
Primary surface: `dev/`

## Phase Goal

Turn the `dev/` surface into a truly polished Eunice admissions experience that feels finished in motion, spacing, copy, and interaction quality.

The highest-value execution queue for this phase is now captured in [docs/parent-application-portal/next-two-high-value-sprints.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/next-two-high-value-sprints.md), which prioritizes parent orientation first and then carries the same cue framework into Admin and the preview hub.

This phase is about:

- making the Parent Portal feel calm, guided, and unmistakably premium
- making the Admin Dashboard feel operational, confident, and fast
- making the preview hub feel like a real product entrance
- refining spacing, hierarchy, and state transitions so the UI feels intentional at every width
- keeping assessment untouched

## Scope Rules

- `dev/` remains the only active implementation surface for this phase.
- `src/` remains untouched until we explicitly promote a finished preview.
- Assessment is out of scope and must not be modified.
- Production promotion is a separate decision after preview stability is confirmed.

## Source References

- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [docs/HANDOVER_BOOTSTRAP_PROMPT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/HANDOVER_BOOTSTRAP_PROMPT.md)
- [docs/SPRINT_NEXT_LANDSCAPE_UI.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_NEXT_LANDSCAPE_UI.md)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)
- [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- [dev/components/nav.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/nav.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)

## Phase Slices

### Slice 1 - Parent Experience Finish

Goal:
- Make the Parent Portal feel like the final polished family-facing admissions journey.

Done when:
- The workflow reads as a calm guided wizard, the support rail feels helpful instead of crowded, and the screen width feels fully used without noise.

### Slice 2 - Admin Operations Finish

Goal:
- Make the Admin Dashboard feel like a confident admissions operations console.

Done when:
- The queue, selected record, and supporting states are easy to scan in one glance and feel properly balanced in landscape.

### Slice 3 - Preview Hub And Brand Entrypoint Finish

Goal:
- Make the preview hub and global shell feel like the clean start point for the Eunice product.

Done when:
- The hub, brand mark, and navigation feel intentional, spacious, and unmistakably Eunice.

### Slice 4 - Cross-Surface Polish And Promotion Readiness

Goal:
- Tighten the last spacing, copy, and interaction details across `dev/` so the preview is ready for a promotion decision.

Done when:
- The experience feels finished enough to compare against the real brand and decide on promotion without further layout rework.

## Exit Criteria

This phase is done when:

- the `dev/` surface feels like a polished Eunice admissions product in wide desktop layouts,
- parent and admin views share the same premium school brand and tone,
- and the project is ready to decide whether a `src/` promotion should happen.
