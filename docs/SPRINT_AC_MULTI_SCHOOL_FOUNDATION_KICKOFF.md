# Sprint AC - Multi-School Foundation Kickoff

**Status:** Planned

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

