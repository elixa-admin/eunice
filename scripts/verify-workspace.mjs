#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const workspaceArg = process.argv[2] || 'src';
const timeoutMs = Number(process.env.EUNICE_VERIFY_TIMEOUT_MS || 45000);
const allowedWorkspaces = new Set(['src', 'dev']);

if (!allowedWorkspaces.has(workspaceArg)) {
  console.error(`Unsupported workspace "${workspaceArg}". Use one of: ${Array.from(allowedWorkspaces).join(', ')}`);
  process.exit(1);
}

if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
  console.error('EUNICE_VERIFY_TIMEOUT_MS must be a positive number.');
  process.exit(1);
}

const workspaceDir = path.join(rootDir, workspaceArg);
const binDir = path.join(workspaceDir, 'node_modules', '.bin');

const steps = [
  {
    name: 'lint',
    command: path.join(binDir, 'eslint'),
    args: ['app', 'components', 'lib', 'next.config.ts'],
  },
  {
    name: 'typecheck',
    command: path.join(binDir, 'tsc'),
    args: ['--noEmit'],
  },
];

function printHeader(message) {
  process.stdout.write(`\n[verify:${workspaceArg}] ${message}\n`);
}

function printFailureGuidance(stepName) {
  process.stderr.write(
    [
      '',
      `[verify:${workspaceArg}] ${stepName} timed out after ${timeoutMs}ms.`,
      '[verify] Classify this as config or environment first unless there is a visible code error.',
      '[verify] Fallback: use structural sweeps, targeted file review, and continue with the smallest safe slice.',
      '[verify] If this repeats, record it in docs/QUICKFIX_KB.md.',
      '',
    ].join('\n'),
  );
}

function runStep(step) {
  return new Promise((resolve, reject) => {
    printHeader(`starting ${step.name}`);

    const child = spawn(step.command, step.args, {
      cwd: workspaceDir,
      env: process.env,
      stdio: 'inherit',
    });

    let settled = false;
    let killTimer = null;
    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }

      printFailureGuidance(step.name);
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), 3000);
      settled = true;
      reject(new Error(`${step.name} timed out`));
    }, timeoutMs);

    child.on('error', (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      if (killTimer) {
        clearTimeout(killTimer);
      }
      reject(error);
    });

    child.on('exit', (code, signal) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      if (killTimer) {
        clearTimeout(killTimer);
      }

      if (code === 0) {
        printHeader(`passed ${step.name}`);
        resolve();
        return;
      }

      const detail = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${step.name} failed with ${detail}`));
    });
  });
}

async function main() {
  printHeader(`workspace ${workspaceArg}, timeout ${timeoutMs}ms`);

  for (const step of steps) {
    await runStep(step);
  }

  printHeader('all checks passed');
}

main().catch((error) => {
  process.stderr.write(`[verify:${workspaceArg}] ${error.message}\n`);
  process.exit(1);
});
