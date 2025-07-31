#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

const firecrawlProc = spawn('npx', ['@mseep/firecrawl-mcp'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env }
});

const client = new Client({
  name: 'TestClient',
  version: '1.0.0',
});

(async () => {
  try {
    const transport = new StdioClientTransport(firecrawlProc.stdin, firecrawlProc.stdout);
    await client.connect(transport);
    
    // Test crawling annedamgaard.com
    const result = await client.callTool({
      name: 'crawl_website',
      arguments: { url: 'https://annedamgaard.com' },
    });
    console.log('Crawl result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error during MCP test:', err);
  } finally {
    firecrawlProc.kill();
  }
})(); 