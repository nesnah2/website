#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🚀 Testing Firecrawl MCP Server...\n');

// Start the Firecrawl MCP server
const firecrawlProc = spawn('npx', ['@mseep/firecrawl-mcp'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

let messageId = 1;

// Function to send MCP messages
function sendMessage(method, params) {
  const message = {
    jsonrpc: '2.0',
    id: messageId++,
    method: method,
    params: params
  };
  console.log(`📤 Sending: ${method}`);
  firecrawlProc.stdin.write(JSON.stringify(message) + '\n');
}

// Listen for responses
firecrawlProc.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log(`📥 Received: ${response.method || 'response'}`);
      if (response.result) {
        console.log('✅ Success:', JSON.stringify(response.result, null, 2));
      }
      if (response.error) {
        console.log('❌ Error:', JSON.stringify(response.error, null, 2));
      }
    } catch (e) {
      console.log('📄 Raw output:', line);
    }
  });
});

// Listen for stderr (server logs)
firecrawlProc.stderr.on('data', (data) => {
  console.log('🔧 Server log:', data.toString().trim());
});

// Test sequence
setTimeout(() => {
  console.log('\n=== Step 1: Initialize MCP Connection ===');
  sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'FirecrawlTestClient',
      version: '1.0.0'
    }
  });
}, 1000);

setTimeout(() => {
  console.log('\n=== Step 2: List Available Tools ===');
  sendMessage('tools/list', {});
}, 2000);

setTimeout(() => {
  console.log('\n=== Step 3: Test Crawl of annedamgaard.com ===');
  sendMessage('tools/call', {
    name: 'crawl_website',
    arguments: {
      url: 'https://annedamgaard.com',
      options: {
        pageOptions: {
          waitFor: 2000
        }
      }
    }
  });
}, 4000);

// Clean up after 15 seconds
setTimeout(() => {
  console.log('\n🧹 Cleaning up...');
  firecrawlProc.kill();
  process.exit(0);
}, 15000); 