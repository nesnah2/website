#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'TestClient',
  version: '1.0.0',
});

(async () => {
  try {
    console.log('Connecting to Firecrawl MCP server...');
    
    const transport = new StdioClientTransport('npx', ['@mseep/firecrawl-mcp']);
    await client.connect(transport);
    
    console.log('Connected! Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', JSON.stringify(tools, null, 2));

    console.log('\nTesting crawl of annedamgaard.com...');
    const result = await client.callTool({
      name: 'crawl_website',
      arguments: { 
        url: 'https://annedamgaard.com',
        options: {
          pageOptions: {
            waitFor: 2000
          }
        }
      },
    });
    
    console.log('\nCrawl result:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (err) {
    console.error('Error during MCP test:', err);
  }
})(); 