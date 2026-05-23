#!/usr/bin/env bash

# setup_integrations.sh
# Automates the setup of Linear API token, Vercel environment variables,
# and basic GitHub Actions CI workflow for the Eunice School Intake Platform.
# This script prompts you for the required secrets so you don't have to
# manually edit files or run multiple commands.

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

echo "\n=== Eunice Platform Integration Setup ==="

# -------------------------------------------------
# 1️⃣ Linear API Key
# -------------------------------------------------
if grep -q "LINEAR_API_KEY" .env.example; then
  echo "Linear API key placeholder already exists in .env.example"
else
  echo "Adding LINEAR_API_KEY placeholder to .env.example"
  echo "LINEAR_API_KEY=" >> .env.example
fi

prompt LINEAR_KEY "Enter your Linear API token"
# Update .env.local if it exists, otherwise create it
if [ -f .env.local ]; then
  sed -i '' "s/^LINEAR_API_KEY=.*/LINEAR_API_KEY=$LINEAR_KEY/" .env.local || echo "LINEAR_API_KEY=$LINEAR_KEY" >> .env.local
else
  echo "LINEAR_API_KEY=$LINEAR_KEY" > .env.local
fi

# -------------------------------------------------
# 2️⃣ Vercel integration (requires Vercel CLI)
# -------------------------------------------------
if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Installing it globally via npm..."
  npm install -g vercel
fi

# Ensure you are logged in – this will open a browser if needed
if ! vercel whoami >/dev/null 2>&1; then
  echo "Logging into Vercel..."
  vercel login
fi

# Check if LINEAR_API_KEY already exists for production
if vercel env ls production --json | grep -q '"key":"LINEAR_API_KEY"'; then
  echo "LINEAR_API_KEY already exists on Vercel production. Updating its value..."
  vercel env add LINEAR_API_KEY production --value "$LINEAR_KEY" --yes --force
else
  echo "Adding LINEAR_API_KEY to Vercel production environment..."
  vercel env add LINEAR_API_KEY production --value "$LINEAR_KEY" --yes
fi

# -------------------------------------------------
# 3️⃣ GitHub repository remote (optional)
# -------------------------------------------------
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || true)
  if [ -z "$CURRENT_REMOTE" ]; then
    prompt GITHUB_URL "Enter the GitHub repository URL (e.g., git@github.com:you/repo.git)"
    git remote add origin "$GITHUB_URL"
    echo "Remote 'origin' added: $GITHUB_URL"
  else
    echo "Git remote 'origin' already set to $CURRENT_REMOTE"
  fi
else
  echo "Not a git repository – skipping GitHub remote configuration."
fi

# -------------------------------------------------
# 4️⃣ Create a basic GitHub Actions CI workflow
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
# 5️⃣ Commit and push changes (if you want)
# -------------------------------------------------
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add .env.local .github/workflows/ci.yml .env.example
  git commit -m "chore: add Linear token, Vercel env var, and CI workflow"
  echo "Changes committed. You can now push with 'git push'."
else
  echo "Not a git repo – skipping commit step."
fi

echo "\n✅ Setup complete!"
