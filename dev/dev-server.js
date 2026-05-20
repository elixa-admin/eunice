#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

// Find an available port (starts at 3001, leaving 3000 for assessment/)
function findAvailablePort(startPort = 3001) {
  if (startPort > 3010) {
    console.log(`⚠️ Port search limit reached. Defaulting to 3001.`);
    return Promise.resolve(3001);
  }
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(startPort, 'localhost', () => {
      const port = server.address().port;
      server.close(() => {
        console.log(`✓ Found available port: ${port}`);
        resolve(port);
      });
    });

    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Launch Next.js dev server
async function startDevServer() {
  const port = await findAvailablePort(3001);
  const url = `http://localhost:${port}`;

  console.log('\n🚀 Starting Eunice Platform (src/) dev server...');
  console.log(`📍 Local preview: ${url}\n`);

  let nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
  try {
    nextBin = fs.realpathSync(nextBin);
    console.log(`✓ Resolved Next.js binary realpath: ${nextBin}`);
  } catch (e) {
    console.warn(`⚠️ Failed to resolve realpath of Next.js binary, using default: ${nextBin}`);
  }
  const devServer = spawn(nextBin, ['dev', '-p', port.toString()], {
    stdio: 'inherit',
    cwd: __dirname,
  });

  devServer.on('error', (err) => {
    console.error('❌ Failed to start dev server:', err.message);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping Eunice dev server...');
    devServer.kill();
    process.exit(0);
  });
}

startDevServer();
