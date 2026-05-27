# Sprint Q — Workflow Automation and Communication Trail

**Status:** Complete

## Sprint Goal

Add the lightest useful operational workflow layer after Sprint P so the product starts behaving more like an admissions operating system, not just a polished interface.

This sprint should improve follow-up clarity without introducing heavy infrastructure or over-engineered background systems.

The main rule for this sprint is to keep the workflow layer visible and lightweight first, then connect it to automation later. We want the product to remember what happened, what should happen next, and what the parent should see, without introducing a large orchestration dependency too early.

## Design Direction

- Keep implementation lightweight and modular.
- Scaffold workflow contracts before adding full orchestration.
- Make every communication visible in admin context.
- Keep the parent experience calm: communication should feel reassuring, not noisy.
- Prepare for later `n8n` integration, but do not require it to ship the first workflow pass.

## Scope

### In scope

- communication history model and UI in admin preview/detail
- status-transition notification map
- magic-link reupload flow scaffolding
- lightweight admin visibility for what was sent and what is waiting
- docs and planning updates

### Out of scope

- full production SMS gateway integration
- full `n8n` deployment
- OCR or document intelligence execution
- broad auth refactors unless required by the magic-link path

## P0 — Communication History Visibility

**Goal**

Let staff see what communication has happened for an application without leaving the review workspace.

**Relevant files**

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)

**Proposed approach**

- Add mock communication entries to preview application data.
- Show a compact communication trail in the detail rail.
- Surface the most recent communication status in the admin workbench.

**Acceptance criteria**

- Admin users can see a short communication trail without leaving the review surface.
- The trail shows what was sent, when it was sent, and whether it is still relevant.
- The new data stays preview-friendly and does not require live messaging infrastructure.

**Verify**

- `cd dev && npm run check`
- Browser review of `/dev/admin`
- Browser review of `/dev/application/app-001`

## P1 — Status-to-Notification Mapping

**Goal**

Make it explicit which application states should trigger which messages.

**Relevant files**

- [shared/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/domain/applications.ts)
- [src/lib/parent-application.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/parent-application.ts)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

**Proposed approach**

- Define a lightweight notification map for the key states:
  - `missing documents`
  - `needs reupload`
  - `ready for decision`
  - `accepted`
  - `rejected`
- Keep the map human-readable and ready for later automation wiring.

**Acceptance criteria**

- The workflow states that should trigger communication are documented in one obvious place.
- The map is lightweight enough to use now and detailed enough to wire into `n8n` later.
- The map does not force a backend redesign.

**Verify**

- Read-through of the notification mapping
- Cross-check against current parent/admin state names in the shared domain files

## P2 — Magic-Link Reupload Scaffolding

**Goal**

Prepare a simple path for parents to re-upload a flagged document without navigating the full application flow.

**Relevant files**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)

**Proposed approach**

- Scaffold the route and token concept in a lightweight way.
- Keep the first pass UI-focused and contract-focused.
- Defer live token issuance and transport integration until the workflow shape is stable.

**Acceptance criteria**

- A clear path exists for a parent to land on a single-purpose reupload screen.
- The route and token shape are understandable without implementing live delivery yet.
- The reupload path fits the calm parent flow rather than branching into a full portal reset.

**Verify**

- Read-through of the route contract and helper wiring
- Browser review of the parent flow entry points that would link into the reupload path

## Success Definition

Sprint Q is successful if:

1. Staff can see communication context while reviewing a file.
2. The product has a clear status-to-notification model.
3. The reupload path is shaped cleanly enough to implement later without rethinking the parent flow.
4. The solution stays lightweight and compatible with later `n8n` adoption.

## Out Of Scope

- full SMS or email transport implementation
- automatic queue orchestration
- OCR or document-quality scoring
- heavy workflow engines beyond the later `n8n` layer

## Verify

- `cd dev && npm run check`
- Browser review of `/dev/admin` and `/dev/application/app-001`
- Read-through review of the notification map and reupload flow contracts

## Implementation Notes

- Communication history is surfaced in the `/dev` admin and detail surfaces.
- The notification plan lives in the shared domain and mirrors into the preview shared copy.
- Re-upload routes exist in both `src` and `/dev` as lightweight scaffolds for a later magic-link flow.
