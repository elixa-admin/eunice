# UI Theme And Typography Spec

Last updated: 2026-05-22
Applies to: `dev/` preview surface first, then `src/` as production UI is promoted

## Design Direction

- Tone: premium academic, not playful, not blog-like
- Brand: Eunice green and gold with restrained neutrals
- Interface goal: admissions product, not wireframe

## Typography System

- Primary UI family: `IBM Plex Sans`
- Label family: `IBM Plex Sans Condensed`
- Rationale:
  - neutral and professional in dense dashboards
  - clear numerals and metadata for review workflows
  - better form and table legibility than ornamental serif-led pairings

Reference basis:

- IBM Plex family guidance and cross-platform intent:
  - https://www.ibm.com/design/impact/plex/
  - https://www.ibm.com/design/language/typography/typeface/
- Material typography baseline considerations for screen UI readability:
  - https://m1.material.io/style/typography.html

## CSS Type Tokens

Defined in `dev/app/globals.css`:

- `.type-display-xl`
- `.type-display-lg`
- `.type-title`
- `.type-body`
- `.type-label`
- `.type-metric`

Usage rule:

- Use token classes instead of ad-hoc font-size/tracking in feature views.

## Environment Variables

Documented in `.env.example`:

- `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK`

This fallback only controls CSS fallback family text, while `next/font` remains the canonical loaded font source.

## Handover Rule

- Any future font changes must update:
  - `dev/app/layout.tsx`
  - `dev/app/globals.css`
  - `.env.example`
  - `docs/SOURCE_OF_TRUTH.md`
  - `docs/SESSION_BOOTSTRAP.md`
