#!/usr/bin/env node

const warnPct = Number(process.env.EUNICE_USAGE_WARN_PCT || 75);
const wrapPct = Number(process.env.EUNICE_USAGE_WRAP_PCT || 85);

const used = Number(process.argv[2]);
const limit = Number(process.argv[3]);
const windowLabel = process.argv[4] || 'current window';

if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) {
  console.error('Usage: node scripts/usage-budget.mjs <used> <limit> [window-label]');
  process.exit(1);
}

const pct = (used / limit) * 100;

let mode = 'normal';
let guidance = 'Work normally.';

if (pct >= wrapPct) {
  mode = 'wrap';
  guidance = 'Shorten sprints, finish critical work, document, verify, and prepare commit/publish/handoff.';
} else if (pct >= warnPct) {
  mode = 'priority';
  guidance = 'Prioritize critical-path work, documentation, and publishing. Reduce exploration.';
}

process.stdout.write(
  JSON.stringify(
    {
      window: windowLabel,
      used,
      limit,
      percent: Number(pct.toFixed(2)),
      mode,
      guidance,
      thresholds: {
        warnPct,
        wrapPct,
      },
    },
    null,
    2,
  ) + '\n',
);
