#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🔥 Testing Firecrawl MCP Server...\n');

// Start the server
const server = spawn('npx', ['@mseep/firecrawl-mcp'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('✅ Server started with PID:', server.pid);

// Send initialize message
const initMessage = {
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
};

console.log('\n📤 Sending initialize message...');
server.stdin.write(JSON.stringify(initMessage) + '\n');

// Handle responses
server.stdout.on('data', (data) => {
  console.log('\n📥 Server response:');
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.log('\n🔧 Server log:');
  console.log(data.toString());
});

// Send tools/list after 2 seconds
setTimeout(() => {
  const listMessage = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  console.log('\n📤 Sending tools/list message...');
  server.stdin.write(JSON.stringify(listMessage) + '\n');
}, 2000);

// Clean up after 10 seconds
setTimeout(() => {
  console.log('\n🧹 Cleaning up...');
  server.kill();
  process.exit(0);
}, 10000); 