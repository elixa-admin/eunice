#!/usr/bin/env bash

# setup_github.sh
# Automates GitHub repository configuration for the Eunice School Intake Platform.
# This script:
#   1️⃣ Prompts for the GitHub repository URL and sets it as the "origin" remote.
#   2️⃣ Creates a basic GitHub Actions CI workflow (ci.yml).
#   3️⃣ Stages the changes and creates a commit (you can push manually).
# It does NOT touch Linear or Vercel configuration.

set -euo pipefail

# Helper to ask for input with a prompt
prompt() {
  local var_name="$1"
  local prompt_text="$2"
  read -rp "$prompt_text: " "$var_name"
}

# Determine project root (script location)
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$PROJECT_ROOT"

echo "\n=== GitHub Integration Setup ==="

# -------------------------------------------------
# 1️⃣ Configure GitHub remote
# -------------------------------------------------
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || true)
  GITHUB_URL=""
  if [ -z "$CURRENT_REMOTE" ]; then
    prompt GITHUB_URL "Enter the GitHub repository URL (e.g., git@github.com:you/repo.git)"
    git remote add origin "$GITHUB_URL"
    echo "Remote 'origin' added: $GITHUB_URL"
  else
    echo "Git remote 'origin' already set to $CURRENT_REMOTE"
  fi
else
  echo "⚠️ Not a git repository – skipping remote configuration."
fi

# -------------------------------------------------
# 2️⃣ Create GitHub Actions CI workflow
# -------------------------------------------------
GH_WORKFLOW_DIR=".github/workflows"
GH_WORKFLOW_FILE="$GH_WORKFLOW_DIR/ci.yml"

if [ ! -d "$GH_WORKFLOW_DIR" ]; then
  mkdir -p "$GH_WORKFLOW_DIR"
fi

if [ -f "$GH_WORKFLOW_FILE" ]; then
  echo "GitHub Actions CI workflow already exists at $GH_WORKFLOW_FILE"
else
  cat > "$GH_WORKFLOW_FILE" <<'EOF'
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run lint & tests
        run: |
          npm run lint
          npm test
      - name: Build
        run: npm run build
EOF
  echo "Created GitHub Actions CI workflow at $GH_WORKFLOW_FILE"
fi

# -------------------------------------------------
# 3️⃣ Commit changes (optional)
# -------------------------------------------------
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  rm -f .git/index.lock
  set +e
  git add -A
  # Only commit if there is something to commit
  git diff-index --quiet HEAD --
  if [ $? -eq 0 ]; then
    echo "✅ No changes to commit."
  else
    git commit -m "chore: add GitHub Actions CI workflow"
    echo "✅ Changes committed. You can push with 'git push'"
  fi
  set -e
else
  echo "⚠️ Not a git repo – skipping commit step."
fi

echo "\n✅ GitHub integration setup complete!"
