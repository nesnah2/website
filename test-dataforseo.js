#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'DataForSEO-TestClient',
  version: '1.0.0',
});

const transport = new StdioClientTransport(
  'npx',
  ['dataforseo-mcp-server'],
  { env: { ...process.env } }
);

(async () => {
  try {
    console.log('🔗 Connecting to DataForSEO MCP Server...');
    await client.connect(transport);
    
    console.log('✅ Connected! Listing available tools...');
    
    // List available tools
    const tools = await client.listTools();
    console.log('\n📋 Available DataForSEO Tools:');
    tools.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}: ${tool.description}`);
    });
    
    console.log('\n🎉 DataForSEO MCP Server is ready to use!');
    console.log('\n💡 Example usage:');
    console.log('- Keyword research');
    console.log('- SEO analysis');
    console.log('- Competitor analysis');
    console.log('- SERP data');
    console.log('- Backlink analysis');
    
  } catch (err) {
    console.error('❌ Error connecting to DataForSEO MCP Server:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have DataForSEO credentials in your .env file');
    console.log('2. Check that dataforseo-mcp-server is installed');
    console.log('3. Verify your internet connection');
  }
})(); 