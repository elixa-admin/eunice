#!/bin/bash
# Eunice Admissions Platform — Safe Port Dev Server Launcher
# Ensures:
#  1. Dynamic search for an unused TCP port starting from 3001
#  2. Bind interface explicitly to 0.0.0.0 (all interfaces)
#  3. Reports launch URL bound explicitly to 127.0.0.1

TARGET_DIR="src"
if [ "$1" == "assessment" ]; then
  TARGET_DIR="assessment"
fi

echo "🛡️ Starting dev-safe checker for app directory: '${TARGET_DIR}/'..."

# Function to check if a port is free
is_port_free() {
  local port=$1
  # Use lsof, nc, or bash network redirection to check port availability
  if lsof -i :$port >/dev/null 2>&1 || nc -z 127.0.0.1 $port >/dev/null 2>&1; then
    return 1 # Port is busy
  else
    return 0 # Port is free
  fi
}

# Scan for a unique free port
START_PORT=3001
PORT=$START_PORT
while ! is_port_free $PORT; do
  echo "⚠️ Port $PORT is currently in use. Searching next..."
  PORT=$((PORT + 1))
done

echo "✅ Secured free port: $PORT"
echo "🌐 Next.js dev server will bind to interface: 0.0.0.0"
echo "👉 Review URL: http://127.0.0.1:$PORT"
echo "--------------------------------------------------------"

# Resolve absolute path to app folder
APP_PATH="/Users/brandondienar/Documents/Codex/Projects/Eunice/${TARGET_DIR}"
cd "$APP_PATH"

# Resolve real path of the next binary
NEXT_BIN="./node_modules/.bin/next"
if [ -L "$NEXT_BIN" ]; then
  REAL_NEXT=$(readlink -f "$NEXT_BIN" 2>/dev/null || node -e "console.log(require('fs').realpathSync('$NEXT_BIN'))")
  echo "✓ Resolved symlinked Next.js binary path: $REAL_NEXT"
  NEXT_BIN=$REAL_NEXT
fi

# Launch Next.js dev server explicitly bound to 0.0.0.0 and port using standard npx (local cached only)
exec npx --no-install next dev -p "$PORT" -H 0.0.0.0
