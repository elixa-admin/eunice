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

function safeRead(filePath) {
  if (!filePath || !existsSync(filePath)) return '';
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function summarizeTranscript(transcript) {
  const lines = transcript.split('\n').filter(Boolean);
  const lineCount = lines.length;
  const hasActivity = /apply_patch|run_command|write_file|edit|tool/i.test(transcript);
  const substantial = lineCount >= 80 || hasActivity;

  return { lineCount, hasActivity, substantial };
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

function buildMarkdown(payload, summary) {
  const now = new Date().toISOString();
  const conversationId = payload.conversationId || 'unknown';
  const workspacePaths = Array.isArray(payload.workspacePaths) ? payload.workspacePaths.join(', ') : 'unknown';
  const transcriptPath = payload.transcriptPath || '';
  const artifactDirectoryPath = payload.artifactDirectoryPath || '';
  const formatVersion = '1';
  const usage = payload.usageEstimate;

  return `# Handoff: Antigravity Session

## Snapshot
- Generated at: ${now}
- Conversation ID: ${conversationId}
- Workspace paths: ${workspacePaths}
- Transcript path: ${transcriptPath || 'unknown'}
- Artifact directory: ${artifactDirectoryPath || 'unknown'}
- handoff_format_version: ${formatVersion}
${usage ? `- estimated_session_usage_percent: ${usage.percent}\n- estimated_session_mode: ${usage.mode}` : '- estimated_session_usage_percent: unknown'}

## Why This Exists
- Antigravity stop hook generated this because the session looked substantial enough to preserve.
- This file is intended to help the next agent continue without re-reading the entire thread.

## Heuristic Summary
- Transcript line count: ${summary.lineCount}
- Activity detected: ${summary.hasActivity ? 'yes' : 'no'}
- Substantial session: ${summary.substantial ? 'yes' : 'no'}

## Current Thread Notes
- If the session was quiet or administrative only, the hook should skip generation.
- This file should stay in the OS temp directory, not the workspace.
- Use this as a neutral handoff artifact that can be shared across Codex, Claude Code, and Antigravity.

## Open Items
- None recorded in this generated handoff.

## Suggested Skills
- handoff
- implement
- plan
- review

## Source Pointers
- Transcript: ${transcriptPath || 'n/a'}
- Artifacts: ${artifactDirectoryPath || 'n/a'}
`;
}

async function main() {
  const raw = await readStdin();
  const payload = raw ? JSON.parse(raw) : {};
  const transcript = safeRead(payload.transcriptPath);
  const summary = summarizeTranscript(transcript);
  const usageEstimate = estimateUsage(payload.transcriptPath);
  const force = process.env.HANDOFF_FORCE === '1';

  if (!force && !summary.substantial) {
    process.stdout.write(JSON.stringify({ skipped: true, reason: 'session_not_substantial' }));
    return;
  }

  const outputDir = os.tmpdir();
  const fileName = `handoff-antigravity-${Date.now()}.md`;
  const outputPath = path.join(outputDir, fileName);
  const markdown = buildMarkdown({ ...payload, usageEstimate }, summary);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, markdown, 'utf8');

  process.stdout.write(JSON.stringify({ skipped: false, outputPath, usageEstimate }));
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
