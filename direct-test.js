#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Starting Firecrawl MCP server test...');

// Start the Firecrawl MCP server
const firecrawlProc = spawn('npx', ['@mseep/firecrawl-mcp'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env }
});

console.log('Firecrawl MCP server started with PID:', firecrawlProc.pid);

// Send a simple test message to see if it responds
setTimeout(() => {
  console.log('Sending test message...');
  firecrawlProc.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'TestClient',
        version: '1.0.0'
      }
    }
  }) + '\n');
}, 1000);

// Listen for responses
firecrawlProc.stdout.on('data', (data) => {
  console.log('Received from server:', data.toString());
});

firecrawlProc.stderr.on('data', (data) => {
  console.log('Server stderr:', data.toString());
});

firecrawlProc.on('close', (code) => {
  console.log('Server process exited with code:', code);
});

// Clean up after 10 seconds
setTimeout(() => {
  console.log('Cleaning up...');
  firecrawlProc.kill();
  process.exit(0);
}, 10000); 