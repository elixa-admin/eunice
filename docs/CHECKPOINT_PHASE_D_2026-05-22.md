# Checkpoint: Phase D Canonical Model Slice

## Current State
- Phase D has started with the canonical data model consolidation slice.
- The shared role state now has one default constructor in `src/lib/domain/intake-roles.ts`.
- The parent workflow consumes that shared default instead of reconstructing the role model locally.
- The role profile field type is now shared as `IntakeRoleProfileField`.
- Draft persistence now uses a versioned local snapshot and merges stored browser state back into the server-loaded draft instead of treating them as separate sources.
- The visible Vercel preview the user is reviewing is the `dev/` surface, so the latest brand and UI uplift is being applied there as well as in `src/`.

## Decisions
- Keep role construction in the domain layer, not in the UI layer.
- Treat submitter, parent, legal guardian, and fee-payer as canonical shared roles.
- Keep the public/admin visual split from Phase C unchanged.
- Use a versioned local draft snapshot for guest and fallback persistence so reloads can recover in-progress work.
- Treat `dev/` as the production-feeling preview surface for UI feedback, while `src/` remains the product app surface.

## Unresolved Issues
- TypeScript verification is still running slowly in this environment, so the next session should recheck if needed.
- The next Phase D slice should focus on workflow state alignment, not more persistence restructuring.
- The preview uplift needs to be pushed and confirmed on the branch preview so the visible instance catches up with the code changes.
- Linear status updates are currently blocked by a reauthentication requirement in the connected app, so the tracker needs a fresh auth pass before the next project update can land there.

## Next Slice
1. Confirm the draft merge behavior stays stable in the current preview branch.
2. Push the `dev/` surface uplift so the branch preview reflects the green/gold Eunice brand and more premium layout.
3. Move to workflow state alignment.
4. Update the checkpoint after each coherent slice.
