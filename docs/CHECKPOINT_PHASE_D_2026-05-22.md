# Checkpoint: Phase D Canonical Model Slice

## Current State
- Phase D has started with the canonical data model consolidation slice.
- The shared role state now has one default constructor in `src/lib/domain/intake-roles.ts`.
- The parent workflow consumes that shared default instead of reconstructing the role model locally.
- The role profile field type is now shared as `IntakeRoleProfileField`.
- Draft persistence now uses a versioned local snapshot and merges stored browser state back into the server-loaded draft instead of treating them as separate sources.

## Decisions
- Keep role construction in the domain layer, not in the UI layer.
- Treat submitter, parent, legal guardian, and fee-payer as canonical shared roles.
- Keep the public/admin visual split from Phase C unchanged.
- Use a versioned local draft snapshot for guest and fallback persistence so reloads can recover in-progress work.

## Unresolved Issues
- TypeScript verification is still running slowly in this environment, so the next session should recheck if needed.
- The next Phase D slice should focus on workflow state alignment, not more persistence restructuring.

## Next Slice
1. Confirm the draft merge behavior stays stable in the current preview branch.
2. Move to workflow state alignment.
3. Update the checkpoint after each coherent slice.
