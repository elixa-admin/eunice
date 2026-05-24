# Phase: Brand-Locked `dev/` UI To Production Readiness

Last updated: 2026-05-24
Branch: `codex/vercel-project-separation`
Primary surface: `dev/`

## Phase Goal

Finish the `dev/` surface as a fully branded Eunice admissions experience that feels ready to promote to production when we explicitly choose to do so.

This phase is about:

- using the full landscape width more effectively
- matching the real Eunice brand, logo, and school identity
- keeping parent and admin surfaces calm, premium, and operational
- turning the preview into a trustworthy admissions product reference
- leaving assessment untouched

## Scope Rules

- `dev/` is the only active implementation surface for this phase.
- `src/` remains untouched until this phase is complete and explicitly promoted.
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

### Slice 1 - Shared Brand Shell

Goal:
- Make the shared shell fully Eunice-branded and landscape-friendly.

Done when:
- The preview shell, nav, and shared card system all feel like one cohesive school product.

### Slice 2 - Parent Portal Landscape Finish

Goal:
- Expand the parent flow so it uses the available width and feels polished at desktop scale.

Done when:
- The center content, guidance rail, and status cues feel balanced and breathable.

### Slice 3 - Admin Review Landscape Finish

Goal:
- Make the admin queue and detail experience feel like a real operations desk.

Done when:
- Queue health, row selection, and record detail all read clearly in one glance.

### Slice 4 - Hub And Route Polish

Goal:
- Make the preview hub and route cards feel like the intentional entrance to the admissions product.

Done when:
- The hub feels like a designed control center, not a card list.

### Slice 5 - Docs And Promotion Readiness

Goal:
- Keep docs aligned, then define the explicit promotion checklist for `src/` and production when the preview is stable.

Done when:
- The next session can continue from docs without rediscovery, and the promotion decision is explicit.

## Exit Criteria

This phase is done when:

- `dev/` feels like the real Eunice admissions product in wide desktop layouts,
- parent and admin views share the real school brand and tone,
- and the project is ready to decide if a `src/` promotion should happen.
