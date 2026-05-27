# Lightweight Platform Direction

**Status:** Active directional brief

## Product Position

Eunice should evolve from a school admissions website into a lightweight admissions operating system.

The product should reduce:

- spreadsheets
- scattered document folders
- manual email follow-up
- document confusion
- reviewer fatigue

The product should improve:

- parent clarity
- document quality
- review speed
- operational visibility
- queue management
- auditability

## Engineering Principles

Optimise for:

- lightweight infrastructure
- low-cost operation
- free or open-source tools where practical
- minimal DevOps overhead
- fast shipping
- maintainable code
- scalable data structures without premature complexity

Avoid:

- enterprise-heavy orchestration
- expensive AI pipelines
- microservice sprawl
- infrastructure that outruns the needs of a single-school deployment
- features that add operational drag without a clear workflow win

## Stack Direction

### Core application

- Next.js App Router for the product surface
- Tailwind CSS for the design system and UI velocity
- PostgreSQL as the system of record

### Recommended operational components

- `n8n` for workflow automation, reminders, routing, notifications, and queue triggers
- `Tesseract OCR` for low-cost OCR extraction on uploaded documents
- lightweight object storage patterns for document uploads and replacements

### Current pragmatic choice

`Supabase` remains a good fit when it materially speeds up delivery through:

- PostgreSQL hosting
- auth
- storage
- row-level security
- realtime where helpful

Use it as a practical accelerator, not as a reason to overbuild.

## Parent Experience Direction

The parent experience must feel:

- calm
- elegant
- guided
- reassuring
- mobile-first
- low-friction

It should behave more like onboarding or KYC than like a dashboard.

Every parent screen should focus on:

- one primary action
- visible progress
- clear missing-document guidance
- status reassurance
- reduced anxiety

## Admin Experience Direction

The admin experience must feel:

- operational
- queue-driven
- fast
- decision-oriented
- filterable
- reviewer-friendly

It should be designed around:

- actions
- queues
- blockers
- waiting states
- readiness for decision

Not around records alone.

## Queue Model

Core queue states:

- New
- Missing Documents
- Needs Review
- Waiting Parent
- Ready For Decision
- Finalised

Each queue item should expose:

- issue
- urgency
- waiting time
- reviewer owner
- next action

## Document System Direction

Each uploaded document should eventually support:

- OCR extraction
- readability scoring
- confidence scoring
- duplicate checks
- document-type tagging
- review notes
- replacement uploads

Useful status vocabulary:

- uploaded
- processing
- verified
- unreadable
- low confidence
- duplicate
- rejected
- approved

Keep this implementation lean and incremental.

## Automation Direction

Prefer `n8n` for:

- reminder emails
- missing document follow-ups
- reviewer assignment
- status-change notifications
- acceptance and rejection communication
- escalation reminders
- audit logging

The automation layer should support the core workflow rather than becoming a platform of its own.

## Multi-School Preparation

Prepare for later support of:

- multiple schools
- school branding
- configurable document requirements
- configurable workflows
- school-specific templates
- role-based permissions

Do not overbuild this yet. Keep the architecture modular and the schema extensible, but ship the single-school path first.

## Most Important Rule

Every screen should answer:

`What is the next action?`

Every workflow should reduce:

- uncertainty
- admin effort
- document chaos
- reviewer fatigue

The product should feel:

- calm for parents
- powerful for staff
- lightweight for engineering
- scalable for the future
