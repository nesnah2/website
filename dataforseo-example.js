#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'DataForSEO-Example',
  version: '1.0.0',
});

const transport = new StdioClientTransport(
  'npx',
  ['dataforseo-mcp-server'],
  { env: { ...process.env } }
);

async function analyzeKeywords(keywords) {
  try {
    console.log('🔗 Connecting to DataForSEO...');
    await client.connect(transport);
    
    console.log(`🔍 Analyzing keywords: ${keywords.join(', ')}`);
    
    // Example: Get keyword data
    const result = await client.callTool({
      name: 'keyword_data',
      arguments: {
        keywords: keywords,
        location_code: 2840, // US
        language_code: 'en'
      }
    });
    
    console.log('✅ Keyword analysis complete!');
    console.log('\n📊 Results:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Example usage
const keywords = ['mens mental health', 'life coaching for men', 'mens mentoring'];
analyzeKeywords(keywords); 