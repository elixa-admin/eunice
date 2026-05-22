# Checkpoint: Phase D Canonical Model Slice

## Current State
- Phase D has started with the canonical data model consolidation slice.
- The shared role state now has one default constructor in `src/lib/domain/intake-roles.ts`.
- The parent workflow consumes that shared default instead of reconstructing the role model locally.
- The role profile field type is now shared as `IntakeRoleProfileField`.

## Decisions
- Keep role construction in the domain layer, not in the UI layer.
- Treat submitter, parent, legal guardian, and fee-payer as canonical shared roles.
- Keep the public/admin visual split from Phase C unchanged.

## Unresolved Issues
- TypeScript verification is still running slowly in this environment, so the next session should recheck if needed.
- The next Phase D slice should focus on persistence and draft safety, not more role restructuring.

## Next Slice
1. Confirm the role-state consolidation stays stable in the current preview branch.
2. Move to persistence and draft safety.
3. Update the checkpoint after each coherent slice.

