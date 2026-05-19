#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// Find an available port
function findAvailablePort(startPort = 3000) {
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

// Launch dev server
async function startDevServer() {
  const port = await findAvailablePort(3000);
  const url = `http://localhost:${port}`;
  
  console.log('\n🚀 Starting Next.js dev server...');
  console.log(`📍 Local preview: ${url}\n`);
  
  const nextBin = require('path').join(__dirname, 'node_modules', '.bin', 'next');
  const devServer = spawn(nextBin, ['dev', '-p', port.toString()], {
    stdio: 'inherit',
    cwd: __dirname
  });

  devServer.on('error', (err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping dev server...');
    devServer.kill();
    process.exit(0);
  });
}

startDevServer();
