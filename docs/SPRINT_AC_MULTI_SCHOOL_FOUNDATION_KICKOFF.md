# Sprint AC - Multi-School Foundation Kickoff

**Status:** In progress

## Goal

Prepare Eunice for a future multi-school rollout while keeping the current implementation lightweight, low-cost, and easy to maintain.

## Why this comes next

The core parent, admin, and workflow experience is now stable enough to begin shaping the configuration boundaries that will matter later, without overbuilding the core product today.

## Focus

- school-level configuration shape
- branding and template separation
- role and permission boundaries
- document requirement profiles
- lightweight school onboarding path

## P0 - Configuration Contract

### Goal

Define one clean school-configuration contract that can drive branding, labels, and requirement profiles without touching heavy infrastructure.

### Focus

- typed school config object and defaults
- school key resolution strategy
- fallback behavior when school config is missing

### Acceptance Criteria

- one source of truth can describe a school
- defaults remain safe and readable
- no regressions in existing Eunice flows

## P1 - Activation In Core Surfaces

### Goal

Activate school configuration in high-visibility parent/admin shell areas and requirement wiring.

### Focus

- shell/title/brand label binding through config
- document requirement profile binding through config
- basic template label switching by school key

### Acceptance Criteria

- parent and admin routes read school values from config
- requirement set can be switched without code duplication
- copy remains calm and consistent

## P2 - Guardrails And Future Hook Points

### Goal

Prepare lightweight extension points for later multi-school rollout while keeping today’s complexity low.

### Focus

- simple permission boundary notes in code/docs
- communication-template key mapping surface
- onboarding checklist for adding one new school

### Acceptance Criteria

- adding a second school is a config task, not a rewrite
- no heavy tenant orchestration introduced
- docs clearly describe how to extend safely

## Not In Scope

- heavy multi-tenant orchestration
- per-school infrastructure duplication
- custom deployment pipelines for each school
- expensive automation layers before the workflow is proven

## Success Criteria

- a single clean config shape can describe a school
- the app can distinguish branding and templates by school
- permissions remain simple and explicit
- the architecture stays easy to ship and low-cost to run

## Verify

- `npm run verify:src`
- `cd dev && npm run check`
- browser review of `/`, `/parent`, `/admin`, `/dev/parent`, `/dev/admin`

## P0 Delivered

- Introduced a typed school configuration contract with explicit defaults and fallback resolution in [src/lib/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/tenant-config.ts).
- Added the same contract surface for the `/dev` app in [dev/eunice-shared/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/eunice-shared/domain/tenant-config.ts).
- Removed hardcoded fallback school IDs in `/dev` runtime paths and now resolve through config:
  - [dev/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/admin/page.tsx)
  - [dev/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/parent/page.tsx)
- Verification passed:
  - `npm run verify:src`
  - `cd dev && npm run check`

## P1 Progress

- Activated school configuration labels in key shells and entry surfaces:
  - [src/app/layout.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/layout.tsx)
  - [dev/app/layout.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/layout.tsx)
  - [src/app/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/page.tsx)
  - [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- Added requirement-profile plumbing in [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts) and wired parent workflow input:
  - [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- Replaced remaining hardcoded school-id fallback usage in `/dev` runtime paths:
  - [dev/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/admin/page.tsx)
  - [dev/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/parent/page.tsx)
