#!/usr/bin/env node

const platform = (process.env.EUNICE_AI_PLATFORM || 'codex').toLowerCase();
const intent = (process.argv[2] || '').toLowerCase();

const dialects = {
  codex: {
    bootstrap: 'Read SESSION_MANIFEST.md, SESSION_CONTINUITY.md, SESSION_BOOTSTRAP.md, and TOOLING_POLICY.md',
    schedule: 'Automations',
    usage: 'Codex usage/status view',
    memory: 'SESSION docs, RELAY_PLAYBOOK.md, and QUICKFIX_KB.md',
    permissions: 'Connector and app permissions',
    review: 'Review the current slice before commit',
    browser: 'Browser or Computer Use',
    background: 'Thread automation / long-running task',
    handoff: 'SESSION_CONTINUITY.md and RELAY_PLAYBOOK.md',
  },
  claude: {
    bootstrap: 'Read CLAUDE.md / project settings, then bootstrap the project',
    schedule: 'Use an external scheduler or a custom slash command that invokes claude -p',
    usage: '/cost',
    memory: '/memory',
    permissions: '/permissions',
    review: '/review or /pr_comments',
    browser: '--chrome',
    background: 'claude agents / claude bg / claude remote-control',
    handoff: 'CLAUDE.md, project settings, and custom slash commands',
  },
  antigravity: {
    bootstrap: 'Open the Project, then read the project instructions and settings',
    schedule: 'Scheduled Tasks',
    usage: 'Status line or usage monitoring via project tooling',
    memory: 'Knowledge Items and project memory',
    permissions: 'Agent permissions allow/deny/ask',
    review: 'Artifact review and user feedback',
    browser: 'Browser command / browser integration',
    background: 'Subagents and scheduled tasks',
    handoff: 'Project settings, Knowledge Items, and artifacts',
  },
};

if (intent === '--list') {
  console.log(Object.keys(dialects.codex).join('\n'));
  process.exit(0);
}

if (!Object.prototype.hasOwnProperty.call(dialects, platform)) {
  console.error(`Unknown platform: ${platform}`);
  process.exit(1);
}

if (!intent) {
  console.error('Usage: EUNICE_AI_PLATFORM=<codex|claude|antigravity> node scripts/command-dialect.mjs <intent>');
  process.exit(1);
}

const mapping = dialects[platform][intent];

if (!mapping) {
  console.error(`Unknown intent: ${intent}`);
  process.exit(1);
}

process.stdout.write(`${mapping}\n`);
