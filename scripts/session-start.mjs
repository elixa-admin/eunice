#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const expectedEnvKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_THEME_FONT_UI_FALLBACK',
];

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: options.cwd || rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: options.timeout || 10000,
    }).trim();
  } catch (error) {
    const message = error.stderr?.toString().trim() || error.message;
    const networkHint =
      /Could not resolve host|ENOTFOUND|getaddrinfo|network/i.test(message)
        ? ' (network/auth may require the normal unrestricted CLI path)'
        : '';
    return `unavailable${networkHint}: ${message}`;
  }
}

function readEnvKeys(filePath) {
  if (!existsSync(filePath)) return new Set();

  const contents = readFileSync(filePath, 'utf8');
  return new Set(
    contents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => line.split('=')[0].trim()),
  );
}

function checkEnvTemplate() {
  const examplePath = path.join(rootDir, '.env.example');
  const localPath = path.join(rootDir, '.env.local');
  const exampleKeys = readEnvKeys(examplePath);
  const localKeys = readEnvKeys(localPath);

  return expectedEnvKeys.map((key) => ({
    key,
    template: exampleKeys.has(key),
    local: localKeys.has(key),
  }));
}

function newestVercelPreview() {
  const devDir = path.join(rootDir, 'dev');
  if (!existsSync(devDir)) {
    return 'dev/ directory missing';
  }

  const output = run('vercel', ['ls', 'eunice-dev', '--scope', 'elixa-admins-projects'], {
    cwd: devDir,
    timeout: 15000,
  });

  const match = output.match(/https:\/\/eunice-[^\s]+\.vercel\.app/);
  return match?.[0] || output.split('\n').slice(0, 4).join('\n');
}

function section(title) {
  console.log(`\n## ${title}`);
}

section('Eunice Session Start');
console.log(`Repo: ${rootDir}`);
console.log(`Branch: ${run('git', ['branch', '--show-current'])}`);
console.log(`Latest commit: ${run('git', ['log', '-1', '--oneline'])}`);
console.log(`Remote: ${run('git', ['remote', 'get-url', 'origin'])}`);
console.log(`Remote head: ${run('git', ['ls-remote', 'origin', 'codex/vercel-project-separation'])}`);

section('Working Tree');
const status = run('git', ['status', '--short']);
console.log(status || 'clean');

section('Environment Keys');
for (const item of checkEnvTemplate()) {
  const template = item.template ? 'template ok' : 'missing from .env.example';
  const local = item.local ? 'local present' : 'local not found';
  console.log(`- ${item.key}: ${template}; ${local}`);
}

section('Vercel Preview');
console.log(newestVercelPreview());

section('Connector Notes');
console.log('- GitHub: use git/gh or connector depending on task.');
console.log('- Vercel: branch push deploys the dev preview.');
console.log('- Linear: if 401 appears, reconnect once and do not loop writes.');
console.log('- Supabase/Resend: confirm real keys before backend, storage, schema, or email work.');

section('Read First');
console.log('1. docs/SOURCE_OF_TRUTH.md');
console.log('2. docs/HANDOVER_BOOTSTRAP_PROMPT.md');
console.log('3. docs/PLATFORM_RELAY_PROTOCOL.md');
console.log('4. docs/GUIDED_APPLICATION_FLOW_PLAN.md');

section('Next Slice');
console.log('Kick off Phase 2 MVP Foundation: deploy SQL migrations and configure main Next.js routes under src/.');
