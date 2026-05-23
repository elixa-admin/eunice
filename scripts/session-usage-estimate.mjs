#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const lineTarget = Number(process.env.EUNICE_SESSION_LINE_TARGET || 200);
const toolTarget = Number(process.env.EUNICE_SESSION_TOOL_TARGET || 25);
const wordTarget = Number(process.env.EUNICE_SESSION_WORD_TARGET || 12000);

const transcriptPath = process.argv[2];

if (!transcriptPath) {
  console.error('Usage: node scripts/session-usage-estimate.mjs <transcript-path>');
  process.exit(1);
}

function safeRead(filePath) {
  if (!existsSync(filePath)) return '';
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

const transcript = safeRead(transcriptPath);
const lines = transcript.split('\n').filter(Boolean);
const words = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
const toolEvents = countMatches(transcript, /\b(run_command|write_file|read_file|apply_patch|view_file|browser_[a-z_]+|mcp__)/gi);
const linePct = Math.min(100, (lines.length / lineTarget) * 100);
const toolPct = Math.min(100, (toolEvents / toolTarget) * 100);
const wordPct = Math.min(100, (words / wordTarget) * 100);
const composite = Number((linePct * 0.5 + toolPct * 0.35 + wordPct * 0.15).toFixed(2));

let mode = 'normal';
let guidance = 'Work normally.';

if (composite >= 85) {
  mode = 'wrap';
  guidance = 'You are deep into the session. Finish critical work, document decisions, verify, and prepare a handoff.';
} else if (composite >= 65) {
  mode = 'priority';
  guidance = 'You are well into the session. Prioritize the critical path, reduce exploration, and keep a handoff in mind.';
}

process.stdout.write(
  JSON.stringify(
    {
      transcriptPath,
      lineTarget,
      toolTarget,
      wordTarget,
      lines: lines.length,
      words,
      toolEvents,
      percent: composite,
      mode,
      guidance,
      breakdown: {
        lines: Number(linePct.toFixed(2)),
        tools: Number(toolPct.toFixed(2)),
        words: Number(wordPct.toFixed(2)),
      },
    },
    null,
    2,
  ) + '\n',
);
