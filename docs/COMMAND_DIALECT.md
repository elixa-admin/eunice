# Command Dialect

This repo uses a shared intent vocabulary so Codex, Claude Code, and Antigravity can speak the same operational language while still using their native commands and settings.

## Rule

- Use one canonical intent name across platforms.
- Translate that intent into the platform’s native command or workflow.
- Keep the translation in this repo so the next session or relay can reuse it.

## Recommended Environment Variable

- `EUNICE_AI_PLATFORM`: selects the active dialect.
- Valid values: `codex`, `claude`, `antigravity`

Example:

```bash
EUNICE_AI_PLATFORM=claude node scripts/command-dialect.mjs usage
```

## Canonical Intents

| Intent | Codex | Claude Code | Antigravity |
| --- | --- | --- | --- |
| `bootstrap` | Read `SESSION_MANIFEST.md`, `SESSION_CONTINUITY.md`, `SESSION_BOOTSTRAP.md`, `TOOLING_POLICY.md` | Read `CLAUDE.md` / project settings, then bootstrap the project | Open the Project, then read the project instructions and settings |
| `schedule` | Automations / recurring thread task | No verified native schedule command in current docs; use an external scheduler or custom slash command that invokes `claude -p` | Scheduled Tasks |
| `usage` | Codex usage/status view | `/cost` | Status line / usage monitoring via project tooling |
| `usage_budget` | Check current usage/status against the next 4 hours and 7-day limit | `/cost` plus current account/status context | Status line or usage monitoring plus project budget policy |
| `memory` | Session docs, relay playbook, QuickFix KB | `/memory` and `CLAUDE.md` | Knowledge Items and project memory |
| `permissions` | Connector and app permissions | `/permissions`, settings allow/deny, `--permission-mode` | Agent permissions allow/deny/ask |
| `review` | Review the current slice before commit | `/review` or `/pr_comments` | Artifact review and user feedback |
| `browser` | Browser or Computer Use | `--chrome` | Browser command / browser integration |
| `background` | Thread automation / long-running task | `claude agents`, `claude bg`, `claude remote-control` | Subagents and scheduled tasks |
| `handoff` | `SESSION_CONTINUITY.md` and `RELAY_PLAYBOOK.md` | `CLAUDE.md`, project settings, and custom slash commands | Project settings, Knowledge Items, and artifacts |

## Notes

- Claude Code’s documented usage command is `/cost`, while `/status` reports account and system state.
- The project-level `usage_budget` intent always means “check current usage against the next 4 hours and the 7-day limit, then adjust sprint size accordingly.”
- Antigravity’s documented recurring-work primitive is scheduled tasks.
- When a platform has no verified native equivalent for an intent, prefer the platform’s documented workflow instead of inventing a command name.
- Keep the canonical intent names stable even if the native commands change.
