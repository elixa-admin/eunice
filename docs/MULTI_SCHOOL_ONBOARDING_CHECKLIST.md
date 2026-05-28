# Multi-School Onboarding Checklist

Use this checklist when adding a new school so rollout stays lightweight and configuration-driven.

## 1) Add School Config

- Add a new `SchoolTenantConfig` entry in:
  - [src/lib/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/tenant-config.ts)
  - [dev/eunice-shared/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/eunice-shared/domain/tenant-config.ts)
- Set:
  - `key`
  - `id`
  - `name` and `shortName`
  - `requirementProfileKey`
  - `communicationTemplateSetKey`
  - brand color values

## 2) Wire Requirement Profile

- Add profile-specific requirement behavior in:
  - [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)
- Keep shared base requirements stable and only branch where needed.

## 3) Wire Notification Template Set

- Add school-specific template variants in:
  - [shared/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/domain/applications.ts)
  - [dev/eunice-shared/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/eunice-shared/domain/applications.ts)
- Route re-upload and status transitions through template-set aware helpers.

## 4) Confirm Role Boundaries

- Validate parent/admin/superadmin access expectations in:
  - [src/lib/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/tenant-config.ts)
  - [dev/eunice-shared/domain/tenant-config.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/eunice-shared/domain/tenant-config.ts)
- Keep parent flows school-scoped and admin flows school-limited unless explicit superadmin behavior is required.

## 5) Verify

- Run:
  - `npm run verify:src`
  - `cd dev && npm run check`
- Browser-check:
  - `/`
  - `/parent`
  - `/admin`
  - `/dev/parent`
  - `/dev/admin`

