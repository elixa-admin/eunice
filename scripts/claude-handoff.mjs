#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

function readStdin() {
  return new Promise((resolve) => {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    process.stdin.on('end', () => resolve(input.trim()));
  });
}

function readTranscript(filePath) {
  if (!filePath || !existsSync(filePath)) return '';
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function isSubstantial(transcript) {
  const lines = transcript.split('\n').filter(Boolean).length;
  const activity = /apply_patch|run_command|write_file|edit|tool/i.test(transcript);
  return lines >= 80 || activity;
}

function estimateUsage(transcriptPath) {
  if (!transcriptPath || !existsSync(transcriptPath)) {
    return null;
  }

  try {
    const output = execFileSync('node', ['scripts/session-usage-estimate.mjs', transcriptPath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return output ? JSON.parse(output) : null;
  } catch {
    return null;
  }
}

function render(payload, transcript) {
  const now = new Date().toISOString();
  const lineCount = transcript.split('\n').filter(Boolean).length;
  const formatVersion = '1';
  const usage = payload.usageEstimate;

  return `# Handoff: Claude Code Session

## Snapshot
- Generated at: ${now}
- Conversation ID: ${payload.conversationId || 'unknown'}
- Workspace paths: ${Array.isArray(payload.workspacePaths) ? payload.workspacePaths.join(', ') : 'unknown'}
- Transcript path: ${payload.transcriptPath || 'unknown'}
- handoff_format_version: ${formatVersion}
${usage ? `- estimated_session_usage_percent: ${usage.percent}\n- estimated_session_mode: ${usage.mode}` : '- estimated_session_usage_percent: unknown'}

## Why This Exists
- This session reached a point worth preserving for the next agent.
- The goal is to keep loopback smooth across Codex, Claude Code, and Antigravity.

## Heuristic Summary
- Transcript line count: ${lineCount}
- Substantial session: ${isSubstantial(transcript) ? 'yes' : 'no'}

## Current Thread Notes
- Preserve only the signal needed to restart quickly.
- Reference existing project artifacts instead of duplicating them.
- Keep sensitive details out of the handoff.

## Open Items
- None recorded in this generated handoff.

## Suggested Skills
- handoff
- implement
- plan
- review

## Source Pointers
- Transcript: ${payload.transcriptPath || 'n/a'}
- Artifacts: ${payload.artifactDirectoryPath || 'n/a'}
`;
}

async function main() {
  const raw = await readStdin();
  const payload = raw ? JSON.parse(raw) : {};
  const transcript = readTranscript(payload.transcriptPath);
  const usageEstimate = estimateUsage(payload.transcriptPath);
  const force = process.env.HANDOFF_FORCE === '1';

  if (!force && !isSubstantial(transcript)) {
    process.stdout.write(JSON.stringify({ skipped: true, reason: 'session_not_substantial' }));
    return;
  }

  const outputPath = path.join(os.tmpdir(), `handoff-claude-${Date.now()}.md`);
  mkdirSync(os.tmpdir(), { recursive: true });
  writeFileSync(outputPath, render({ ...payload, usageEstimate }, transcript), 'utf8');

  process.stdout.write(JSON.stringify({ skipped: false, outputPath, usageEstimate }));
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
