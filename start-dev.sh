#!/bin/bash
# Eunice local dev server — auto-finds an unused port starting at 3000
# Usage: ./start-dev.sh  (or launched automatically by .claude/launch.json)
cd /Users/brandondienar/Documents/Codex/Projects/Eunice/assessment
exec node dev-server.js
