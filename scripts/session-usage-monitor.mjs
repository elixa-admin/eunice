#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const thresholds = [65, 85, 95];
const statePath = process.env.EUNICE_USAGE_STATE_PATH || path.join(os.tmpdir(), 'eunice-session-usage-state.json');
const outputMode = process.env.EUNICE_USAGE_OUTPUT_MODE || 'notification';

const transcriptPath = process.argv[2];

if (!transcriptPath) {
  console.error('Usage: node scripts/session-usage-monitor.mjs <transcript-path>');
  process.exit(1);
}

function safeRead(filePath) {
  if (!filePath || !existsSync(filePath)) return '';
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function safeJson(filePath, fallback) {
  const raw = safeRead(filePath);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function runUsageEstimate(targetPath) {
  try {
    const output = execFileSync('node', ['scripts/session-usage-estimate.mjs', targetPath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return output ? JSON.parse(output) : null;
  } catch {
    return null;
  }
}

function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function notify(title, message) {
  try {
    execFileSync('osascript', ['-e', `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)}`], {
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch {
    // Fall back to stdout only.
  }
}

function buildSummary(label, percent, remaining, mode, current, total) {
  return `${label}: ${percent.toFixed(1)}% used, ${remaining.toFixed(1)}% remaining. ${mode}. Current estimate ${current.toFixed(1)} / total ${total.toFixed(1)}.`;
}

const usage = runUsageEstimate(transcriptPath);
if (!usage) {
  process.stdout.write(JSON.stringify({ skipped: true, reason: 'usage_unavailable' }, null, 2) + '\n');
  process.exit(0);
}

const now = new Date();
const dayKey = isoDay(now);
const weekKey = isoWeek(now);
const state = safeJson(statePath, {
  session: {},
  day: {},
  week: {},
  notifications: [],
});

function bucketFor(label, key) {
  if (!state[label] || state[label].key !== key) {
    state[label] = { key, total: 0, notified: [] };
  }
  return state[label];
}

const sessionBucket = bucketFor('session', transcriptPath);
const dayBucket = bucketFor('day', dayKey);
const weekBucket = bucketFor('week', weekKey);

sessionBucket.total = usage.percent;
dayBucket.total = (dayBucket.total || 0) + usage.percent;
weekBucket.total = (weekBucket.total || 0) + usage.percent;

const buckets = [
  { label: 'session', key: transcriptPath, total: sessionBucket.total, notified: sessionBucket.notified || [] },
  { label: 'day', key: dayKey, total: dayBucket.total, notified: dayBucket.notified || [] },
  { label: 'week', key: weekKey, total: weekBucket.total, notified: weekBucket.notified || [] },
];

const fired = [];
for (const bucket of buckets) {
  for (const threshold of thresholds) {
    if (bucket.total >= threshold && !bucket.notified.includes(threshold)) {
      bucket.notified.push(threshold);
      const remaining = Math.max(0, 100 - bucket.total);
      const message = buildSummary(
        `${bucket.label.toUpperCase()} threshold ${threshold}%`,
        bucket.total,
        remaining,
        usage.mode,
        bucket.total,
        100,
      );

      fired.push({ bucket: bucket.label, threshold, percent: Number(bucket.total.toFixed(2)), remaining: Number(remaining.toFixed(2)) });

      if (outputMode === 'notification') {
        notify(`Eunice ${bucket.label} usage`, message);
      }
    }
  }
}

state.session = { key: sessionBucket.key, total: sessionBucket.total, notified: sessionBucket.notified };
state.day = { key: dayBucket.key, total: dayBucket.total, notified: dayBucket.notified };
state.week = { key: weekBucket.key, total: weekBucket.total, notified: weekBucket.notified };
state.lastRun = {
  at: now.toISOString(),
  usage,
};
writeJson(statePath, state);

process.stdout.write(
  JSON.stringify(
    {
      transcriptPath,
      usage,
      statePath,
      fired,
      summary: {
        session: Number(sessionBucket.total.toFixed(2)),
        day: Number(dayBucket.total.toFixed(2)),
        week: Number(weekBucket.total.toFixed(2)),
      },
    },
    null,
    2,
  ) + '\n',
);
