# Database And Environment Strategy

## Purpose

This project uses Supabase as the single backend platform for:

- PostgreSQL database
- authentication
- file storage

The app must work in two separate environments from the start:

- **Development** for safe iteration and seeded test data
- **Production** for the live Eunice admissions workflow

## Core Decision

We do **not** need a separate database technology for Eunice. We need:

1. one database platform
2. two isolated Supabase projects or environments
3. one shared schema
4. one multi-school-ready tenant model

That lets Eunice act as the first real tenant while preserving a clean path to other schools later.

## Environment Model

### Development

- Used for feature work, UI iteration, and test uploads
- May contain seeded or synthetic records
- Must never be treated as production data
- May be reset or migrated aggressively when needed

### Production

- Used only for live Eunice admissions activity
- Must contain real applicant and staff data
- Must be protected by strict access controls and RLS
- Must never be used as a scratch environment

## Required Runtime Variables

The app continues to rely on the standard Supabase runtime variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

These values are environment-specific. The same variable names are used in development and production, but the actual values differ by environment.

## Multi-School Strategy

The schema is designed around a shared platform with school partitioning:

- every school-scoped record carries `school_id`
- access rules should always respect school boundaries
- Eunice is the first tenant, not a one-off fork
- later schools should be added by data and config, not a rewrite

## Practical Rules

- Keep dev and prod credentials separate.
- Use migrations as the source of truth for schema changes.
- Seed only development with test data.
- Never hardcode Eunice into schema logic where a school reference belongs.
- Prefer `school_id` partitioning and RLS over bespoke per-school tables.

## What This Means For The Sprint

The next sprint should treat the database as foundational plumbing, not an afterthought:

- validate the schema shape
- keep the tenant model explicit
- keep the environments separate
- prove uploads and workflow data can survive a real admissions-style use case

