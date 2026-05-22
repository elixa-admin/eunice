# Eunice School Intake Platform

A modern digital admissions and learner intake workflow platform for Eunice High School, with foundations for broader South African school adoption.

## Project Status
🔄 **Baseline phase plan:** Phase 0 — Discovery & Workflow Mapping

### Working Status Snapshot
- Discovery is underway, with live workflow inspection captured in [Current State Scratchpad](./docs/CURRENT_STATE_SCRATCHPAD.md).
- The latest live-form walkthrough confirmed the real Eunice intake shape and is captured in [Live Form Discovery Report](./docs/DISCOVERY_REPORT_LIVE_FORM.md).
- Design and planning prep are active through the sprint and task-board docs in `docs/`.
- Early Phase 2 foundation work has started in the repo, including the real `src/` app surface, the `dev/` preview surface, and initial Supabase migration work.
- Linear is the planning source of truth for the active workstream when a slice is being tracked there.

### Tracker Alignment
- Linear project: `Eunice Admissions Platform`
- GitHub repo: `elixa-admin/eunice`
- Vercel project currently linked in this workspace: `eunice-dev` with root directory `dev`

The phase docs remain the baseline plan, but the current working state is more advanced than the original “not started” markers in the older planning docs.

## Quick Links
- [Single Source Of Truth](./docs/SOURCE_OF_TRUTH.md)
- [UI Theme Spec](./docs/UI_THEME_SPEC.md)
- [Project Brief](./docs/PROJECT_BRIEF.md)
- [Architecture & Tech Stack](./docs/ARCHITECTURE.md)
- [Development Phases](./docs/PHASES.md)
- [Workflow & Requirements](./docs/REQUIREMENTS.md)
- [Current State Scratchpad](./docs/CURRENT_STATE_SCRATCHPAD.md)
- [Live Form Discovery Report](./docs/DISCOVERY_REPORT_LIVE_FORM.md)
- [Engineering Guardrails](./docs/ENGINEERING_GUARDRAILS.md)
- [Pre-Merge Checklist](./docs/PRE_MERGE_CHECKLIST.md)
- [Tooling Policy](./docs/TOOLING_POLICY.md)
- [Session Manifest](./docs/SESSION_MANIFEST.md)
- [Automation Policy](./docs/AUTOMATION_POLICY.md)
- [Architecture Review Cadence](./docs/ARCHITECTURE_REVIEW_CADENCE.md)
- [Phase 2 Next 24 Hours Task Board](./docs/phase-2-next-24h/plan.md)
- [Usage Budget Policy](./docs/USAGE_BUDGET_POLICY.md)
- [Relay Playbook](./docs/RELAY_PLAYBOOK.md)
- [Automation Routines Plan](./docs/automation-routines/plan.md)
- [Session Continuity & Handoff](./docs/SESSION_CONTINUITY.md)
- [Session Bootstrap](./docs/SESSION_BOOTSTRAP.md)
- [Failure Triage](./docs/FAILURE_TRIAGE.md)
- [QuickFix Knowledgebase](./docs/QUICKFIX_KB.md)
- [Command Dialect](./docs/COMMAND_DIALECT.md)
- [Connector Readiness Plan](./docs/connector-readiness/plan.md)
- [Next Stage Enablement Plan](./docs/next-stage-enablement/plan.md)

## Core Vision
**Not** an online form.  
**Is** a workflow orchestration platform for school admissions.

Transform from:
- Manual reviews, document verification, email chasing, spreadsheet tracking
- Fragmented storage, poor visibility, frustrating parent experience

To:
- Automated workflow, centralised tracking, modern parent portal
- Admin dashboard with visibility, reduced repetitive work
- Foundation for scalable SaaS platform across SA schools

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel + GitHub |
| Email | Resend |

## Workspace Shape
- `src/` for the real product app
- `dev/` for the preview surface
- `supabase/` for schema and migrations
- `shared/` for contracts reused across `src/` and `dev/`

## Verification Path
- Prefer `npm run verify:src` for the real app and `npm run verify:dev` for the preview app.
- These bounded checks are the default because they fail clearly if lint or typecheck quietly stall in this environment.

## Key Principles
- Minimise infrastructure complexity
- Use managed services (no Kubernetes, Docker, microservices in MVP)
- Mobile-first, lightweight, modern SaaS feel
- Aggressive scope discipline (admissions workflow only, not full ERP)
- Design for older Android devices + poor connectivity

## Success Metric
Reduce administrative burden, improve workflow visibility, and modernise learner admissions at Eunice High School.
